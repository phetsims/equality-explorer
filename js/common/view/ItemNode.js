// Copyright 2017, University of Colorado Boulder

/**
 * Visual representation of an Item.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  /**
   * @param {Item} item
   * @param {ItemCreator} itemCreator
   * @param {Plate} plate
   * @param {Object} [options]
   * @constructor
   */
  function ItemNode( item, itemCreator, plate, options ) {

    var self = this;

    options = _.extend( {
      cursor: 'pointer',
      shadowOffset: new Dimension2( 4, 4 )
    }, options );

    // @public (read-only)
    this.item = item;

    // @private
    this.itemCreator = itemCreator;

    var shadowNode = new Node( {
      children: [ item.iconShadow ], // wrap the icon since we're using scenery DAG feature and need to offset it
      opacity: 0.4,
      left: item.icon.left + options.shadowOffset.width,
      top: item.icon.top + options.shadowOffset.height,
      visible: false
    } );

    assert && assert( !options.children, 'this type defines its children' );
    options.children = [ shadowNode, item.icon ]; // wrap the icon since we're using scenery DAG feature

    Node.call( this, options );

    // synchronize location with model
    var locationObserver = function( location ) {
      
      // compensate for the shadow, so that position is in the center of the icon
      self.centerX = location.x + ( options.shadowOffset.width / 2 );
      self.centerY = location.y + ( options.shadowOffset.height / 2 );
    };
    item.locationProperty.link( locationObserver ); // unlink in dispose

    // {Vector2} where the drag started relative to locationProperty, in parent view coordinates
    var startDragOffset;

    // @public (read-only)
    this.dragListener = new SimpleDragHandler( {

      allowTouchSnag: true,

      start: function( event, trail ) {

        item.dragging = true;
        shadowNode.visible = true;

        self.moveToFront();

        // move up and left, same amount as shadow offset so the shadow appears where the Item was
        self.item.locationProperty.value =
          self.item.locationProperty.value.plusXY( -options.shadowOffset.width, -options.shadowOffset.height );

        if ( plate.containsItem( item ) ) {
          plate.removeItem( item );
          self.itemCreator.removeItemFromScale( item );
        }
        startDragOffset = self.globalToParentPoint( event.pointer.point ).minus( item.locationProperty.value );
      },

      drag: function( event, trail ) {
        var location = self.globalToParentPoint( event.pointer.point ).minus( startDragOffset );
        var boundedLocation = item.dragBounds.closestPointTo( location );
        item.moveTo( boundedLocation );
      },

      end: function( event, trail ) {

        item.dragging = false;
        shadowNode.visible = false;

        if ( item.locationProperty.value.y > plate.locationProperty.value.y ) {

          // Item was released below the plate, animate back to panel and dispose
          self.animateToPanel( item );
        }
        else {

          // Item was released above the plate, animate to closest available cell
          self.animateToClosestCell( item, plate );
        }
      }
    } );
    this.addInputListener( this.dragListener );

    // @private
    this.disposeItemNode = function() {
      item.locationProperty.unlink( locationObserver );
    };
  }

  equalityExplorer.register( 'ItemNode', ItemNode );

  return inherit( Node, ItemNode, {

    /**
     * @public
     * @override
     */
    dispose: function() {
      this.disposeItemNode();
      Node.prototype.dispose.call( this );
    },

    /**
     * Returns an Item to the panel where it was created.
     * @param {Item} item
     * @private
     */
    animateToPanel: function( item ) {
      item.animateTo( item.locationProperty.initialValue, {
        animationCompletedCallback: function() {
          item.dispose();
        }
      } );
    },

    /**
     * Animates an Item to an empty cell on the plate.
     * @param {Item} item
     * @param {Plate} plate
     * @private
     */
    animateToClosestCell: function( item, plate ) {

      var self = this;

      var cell = plate.getClosestEmptyCell( item.locationProperty.value );
      if ( !cell ) {

        // Plate has become full, or there is no available cell above the item's location.
        // Return the item to panel.
        this.animateToPanel( item );
      }
      else {

        var cellLocation = plate.getCellLocation( cell );

        item.animateTo( cellLocation, {

          // If the target cell has become occupied, choose another cell.
          animationStepCallback: function() {
            if ( !plate.isEmptyCell( cell ) ) {
              self.animateToClosestCell( item, plate );
            }
          },

          // When the Item reaches the cell, put it in the cell.
          animationCompletedCallback: function() {
            plate.addItem( item, cell );
            self.itemCreator.addItemToScale( item );
          }
        } );
      }
    }
  } );
} );
