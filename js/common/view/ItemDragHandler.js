// Copyright 2017, University of Colorado Boulder

/**
 * Drag handler for items.
 *
 * Note that event.currentTarget should NOT be used herein. Because of event forwarding from ItemCreatorNode,
 * event.currentTarget may not be what you expect it to be.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ConstantItem = require( 'EQUALITY_EXPLORER/common/model/ConstantItem' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var SumToZeroNode = require( 'EQUALITY_EXPLORER/common/view/SumToZeroNode' );
  var XItem = require( 'EQUALITY_EXPLORER/common/model/XItem' );

  /**
   * @param {Node} itemNode - Node that the listener is attached to
   * @param {AbstractItem} item
   * @param {AbstractItemCreator} itemCreator
   * @param {Plate} plate
   * @param {Object} [options]
   * @constructor
   */
  function ItemDragHandler( itemNode, item, itemCreator, plate, options ) {

    options = _.extend( {
      haloRadius: 10,
      mouseXOffset: -4,
      touchXOffset: -4
    }, options );

    // {Node} item the is the inverse of the item being dragged. E.g. 1 and -1, x and -x
    var inverseItem = null;

    SimpleDragHandler.call( this, {

      allowTouchSnag: true,

      /**
       * Called at the start of a drag cycle, on pointer down.
       * @param {Event} event
       * @param {Trail} trail
       */
      start: function( event, trail ) {

        item.dragging = true;
        item.shadowVisibleProperty.value = true;

        itemNode.moveToFront();

        item.moveTo( eventToLocation( event, itemNode, item, options.mouseXOffset, options.touchXOffset ) );

        if ( plate.containsItem( item ) ) {
          plate.removeItem( item );
          itemCreator.removeItemFromScale( item );
        }
      },

      /**
       * Called while the Node is being dragged.
       * @param {Event} event
       * @param {Trail} trail
       */
      drag: function( event, trail ) {

        // move the item
        item.moveTo( eventToLocation( event, itemNode, item, options.mouseXOffset, options.touchXOffset ) );

        // handle overlap with inverse item
        if ( item.constructor === ConstantItem || item.constructor === XItem ) {

          var previousInverseItem = inverseItem;
          inverseItem = null;

          var itemOnPlate = plate.getItemAtLocation( item.locationProperty.value );
          if ( itemOnPlate && itemOnPlate.isInverseOf( item ) ) {
            inverseItem = itemOnPlate;
          }

          // clean up previous inverse item
          if ( previousInverseItem && ( previousInverseItem !== inverseItem ) ) {
            previousInverseItem.haloVisibleProperty.value = false;
          }

          // handle new inverse item
          if ( !inverseItem ) {
            item.shadowVisibleProperty.value = true;
            item.haloVisibleProperty.value = false;
          }
          else if ( previousInverseItem !== inverseItem ) {
            item.shadowVisibleProperty.value = false;
            item.haloVisibleProperty.value = true;
            inverseItem.haloVisibleProperty.value = true;
          }
        }
      },

      /**
       * Called at the end of a drag cycle, on pointer up.
       * @param {Event} event
       * @param {Trail} trail
       */
      end: function( event, trail ) {

        item.dragging = false;
        item.shadowVisibleProperty.value = false;

        if ( item.locationProperty.value.y > plate.locationProperty.value.y ) {

          // item was released below the plate, animate back to panel and dispose
          animateToPanel( item );
        }
        else if ( inverseItem && inverseItem.isInverseOf( item ) ) {

          // handle 'sum to zero' of item and its inverse

          // determine where the '0' or '0x' appears
          var inverseItemLocation = inverseItem.locationProperty.value;
          var parent = itemNode.getParent();
          var itemConstructor = item.constructor;

          // delete the 2 items that sum to zero
          item.dispose();
          inverseItem.dispose();

          // show '0' or '0x' in yellow halo, fade out
          var sumToZeroNode = new SumToZeroNode( itemConstructor, {
            haloRadius: options.haloRadius,
            center: inverseItemLocation
          } );
          parent.addChild( sumToZeroNode );
          sumToZeroNode.startAnimation();
        }
        else {

          // item was released above the plate, animate to closest empty cell
          animateToClosestEmptyCell( item, itemCreator, plate );
        }
      }
    } );
  }

  equalityExplorer.register( 'ItemDragHandler', ItemDragHandler );

  /**
   * Converts an event to a model location.
   * Enforces relationship of the item to the pointer, and constrains the drag bounds.
   * @param {Event} event
   * @param {Node} itemNode
   * @param {AbstractItem} item
   * @param {number} mouseXOffset
   * @param {number} touchXOffset
   * @returns {Vector2}
   * @private
   */
   function eventToLocation( event, itemNode, item, mouseXOffset, touchXOffset ) {

    // touch: move icon above finger
    // mouse: move bottom center of icon to pointer location
    var xOffset = ( event.pointer.isTouch ) ? touchXOffset : mouseXOffset;
    var yOffset = ( event.pointer.isTouch ) ? -( 1.5 * item.icon.height ) : -( 0.5 * item.icon.height );
    var location = itemNode.globalToParentPoint( event.pointer.point ).plusXY( xOffset, yOffset );
    return item.dragBounds.closestPointTo( location );
  }

  /**
   * Returns an Item to the panel where it was created.
   * @param {AbstractItem} item
   * @private
   */
  function animateToPanel( item ) {
    item.animateTo( item.locationProperty.initialValue, {
      animationCompletedCallback: function() {
        item.dispose();
      }
    } );
  }

  /**
   * Animates an item to an empty cell on the plate.
   * @param {AbstractItem} item
   * @param {AbstractItemCreator} itemCreator
   * @param {Plate} plate
   * @private
   */
  function animateToClosestEmptyCell( item, itemCreator, plate ) {

    var cellIndex = plate.getClosestEmptyCell( item.locationProperty.value );
    if ( cellIndex === -1 ) {

      // Plate has become full, or there is no available cell above the item's location.
      // Return the item to panel.
      animateToPanel( item );
    }
    else {

      var cellLocation = plate.getLocationForCell( cellIndex );

      item.animateTo( cellLocation, {

        // If the target cell has become occupied, choose another cell.
        animationStepCallback: function() {
          if ( !plate.isEmptyCell( cellIndex ) ) {
            animateToClosestEmptyCell( item, itemCreator, plate );
          }
        },

        // When the item reaches the cell, put it in the cell.
        animationCompletedCallback: function() {
          plate.addItem( item, cellIndex );
          itemCreator.addItemToScale( item );
        }
      } );
    }
  }

  return inherit( SimpleDragHandler, ItemDragHandler );
} );
 