// Copyright 2017, University of Colorado Boulder

/**
 * Visual representation of an Item.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
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
      cursor: 'pointer'
    }, options );

    // @public (read-only)
    this.item = item;

    // @private
    this.itemCreator = itemCreator;

    assert && assert( !options.children, 'this subtype defines its children' );
    options.children = [ item.icon ]; // wrap the icon since we're using scenery DAG feature

    var shadowNode = new Node( {
      children: [ item.shadowIcon ], // wrap the icon since we're using scenery DAG feature
      opacity: 0.4,
      left: item.icon.left + 4,
      top: item.icon.top + 4
    } );

    Node.call( this, options );

    // synchronize location with model
    var locationObserver = function( location ) {
      self.center = location;
    };
    item.locationProperty.link( locationObserver ); // unlink in dispose

    // {Vector2} where the drag started relative to locationProperty, in parent view coordinates
    var startDragOffset;

    // @public (read-only)
    this.dragListener = new SimpleDragHandler( {

      allowTouchSnag: true,

      start: function( event, trail ) {
        item.dragging = true;

        //TODO change addChild to visible and ignore shadow when positioning this Node
        // add a shadow while dragging
        self.addChild( shadowNode );
        shadowNode.moveToBack();

        self.moveToFront();

        // move up and left
        self.item.locationProperty.value = self.item.locationProperty.value.plusXY( -2, -2 );

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

        //TODO change removeChild to visible
        // remove the shadow when drag ends
        self.removeChild( shadowNode );

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

    // @public @override
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
