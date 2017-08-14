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
   * @param {WeighingPlatform} weighingPlatform
   * @param {Object} [options]
   * @constructor
   */
  function ItemNode( item, weighingPlatform, options ) {

    var self = this;

    options = _.extend( {
      cursor: 'pointer'
    }, options );

    // @public (read-only)
    this.item = item;

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [ item.icon ]; // wrap the icon since we're using scenery DAG feature

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

      allowTouchSnag: options.allowTouchSnag,

      start: function( event, trail ) {
        item.dragging = true;

        // move up slightly
        self.item.locationProperty.value = self.item.locationProperty.value.plusXY( 0, -5 );

        if ( weighingPlatform.containsItem( item ) ) {
          weighingPlatform.removeItem( item );
          //TODO move item to global (dragLayer) coordinate frame
          //TODO move itemNode from weighingPlatformNode to dragLayer
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

        if ( item.locationProperty.value.y > weighingPlatform.locationProperty.value.y ) {

          // Item was released below the platform, animate back to panel and dispose
          self.animateToPanel( item );
        }
        else {

          // Item was released above the platform, animate to closest available cell
          self.animateToClosestCell( item, weighingPlatform );
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
     */
    animateToPanel: function( item ) {
      item.animateTo( item.locationProperty.initialValue, {
        animationCompletedCallback: function() {
          item.dispose();
        }
      } );
    },

    /**
     * Animates an Item to an empty cell on the weighing platform.
     * @param {Item} item
     * @param {WeighingPlatform} weighingPlatform
     */
    animateToClosestCell: function( item, weighingPlatform ) {

      var self = this;

      var cell = weighingPlatform.getClosestEmptyCell( item.locationProperty.value );
      if ( !cell ) {

        // Platform has become empty, or there is no available cell above the item's location.
        // Return the item to panel.
        this.animateToPanel( item );
      }
      else {

        var cellLocation = weighingPlatform.getCellLocation( cell );

        item.animateTo( cellLocation, {

          // If the target cell has become occupied, choose another cell.
          animationStepCallback: function() {
            if ( !weighingPlatform.isEmptyCell( cell ) ) {
              self.animateToClosestCell( item, weighingPlatform );
            }
          },

          // When the Item reaches the cell, put it in the cell.
          animationCompletedCallback: function() {
            weighingPlatform.addItem( item, cell );
            //TODO move itemNode from dragLayer to weighingPlatformNode
            //TODO move item location to weighingPlatform coordinate frame
          }
        } );
      }
    }
  } );
} );
