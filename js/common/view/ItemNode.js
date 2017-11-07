// Copyright 2017, University of Colorado Boulder

/**
 * Visual representation of an item.
 * Origin is at the center of the item's icon.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var ConstantItem = require( 'EQUALITY_EXPLORER/common/model/ConstantItem' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var HaloNode = require( 'EQUALITY_EXPLORER/common/view/HaloNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var SumToZeroNode = require( 'EQUALITY_EXPLORER/common/view/SumToZeroNode' );
  var XItem = require( 'EQUALITY_EXPLORER/common/model/XItem' );

  /**
   * @param {AbstractItem} item
   * @param {AbstractItemCreator} itemCreator
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

    var iconNode = new Node( {
      children: [ item.icon ], // wrap the icon since we're using scenery DAG feature and need to offset it

      // put origin at the center of the icon
      centerX: 0,
      centerY: 0
    } );

    // shadow, offset from the icon
    var shadowNode = new Node( {
      children: [ item.iconShadow ], // wrap the shadow since we're using scenery DAG feature and need to offset it
      opacity: 0.4,
      right: iconNode.right + options.shadowOffset.width,
      bottom: iconNode.bottom + options.shadowOffset.height,
      visible: false
    } );

    assert && assert( !options.children, 'this type defines its children' );
    options.children = [ shadowNode, iconNode ];

    // @private {Node|null} halo around the icon
    this.haloNode = null;
    if ( item.constructor === ConstantItem || item.constructor === XItem ) {
      var haloRadius = 0.85 * Math.max( plate.cellSize.width, plate.cellSize.height );
      this.haloNode = new HaloNode( haloRadius, {
        center: iconNode.center,
        visible: false
      } );
      options.children.unshift( this.haloNode );
    }

    if ( EqualityExplorerQueryParameters.showOrigin ) {
      options.children.push( new Circle( 4, { fill: 'red' } ) );
    }

    Node.call( this, options );

    // model controls location
    var locationObserver = function( location ) {
      self.translation = location;
    };
    item.locationProperty.link( locationObserver ); // unlink in dispose

    // model controls visibility of shadow
    item.shadowVisibleProperty.link( function( shadowVisible ) {
      shadowNode.visible = shadowVisible;
    } );

    // model controls visibility of halo
    item.haloVisibleProperty.link( function( haloVisible ) {
      if ( self.haloNode ) {
        self.haloNode.visible = haloVisible;
      }
    } );

    // {Vector2} where the drag started relative to locationProperty, in parent view coordinates
    var startDragOffset;

    // {Node} item the is the inverse of the item being dragged. E.g. 1 and -1, x and -x
    var inverseItem = null;

    // @public (read-only)
    this.dragListener = new SimpleDragHandler( {

      allowTouchSnag: true,

      start: function( event, trail ) {

        item.dragging = true;
        item.shadowVisibleProperty.value = true;

        self.moveToFront();

        // move up and left, same amount as shadow offset so the shadow appears where the item was
        self.item.locationProperty.value =
          self.item.locationProperty.value.plusXY( -options.shadowOffset.width, -options.shadowOffset.height );

        if ( plate.containsItem( item ) ) {
          plate.removeItem( item );
          self.itemCreator.removeItemFromScale( item );
        }
        startDragOffset = self.globalToParentPoint( event.pointer.point ).minus( item.locationProperty.value );
      },

      drag: function( event, trail ) {

        // move the item
        var location = self.globalToParentPoint( event.pointer.point ).minus( startDragOffset );
        var boundedLocation = item.dragBounds.closestPointTo( location );
        item.moveTo( boundedLocation );

        // identify inverse item
        var previousInverseItem = inverseItem;
        inverseItem = null;
        if ( ( item instanceof ConstantItem ) || ( item instanceof XItem ) ) {
          var itemOnPlate = plate.getItemAtLocation( item.locationProperty.value );
          if ( itemOnPlate && itemOnPlate.isInverseOf( item ) ) {
            inverseItem = itemOnPlate;
          }
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
      },

      end: function( event, trail ) {

        item.dragging = false;
        item.shadowVisibleProperty.value = false;

        if ( item.locationProperty.value.y > plate.locationProperty.value.y ) {

          // item was released below the plate, animate back to panel and dispose
          self.animateToPanel( item );
        }
        else if ( ( item instanceof ConstantItem ) || ( item instanceof XItem ) ) {

          // sum to zero, delete item and its inverse
          if ( inverseItem && inverseItem.isInverseOf( item ) ) {

            // determine where the '0' appears
            var inverseItemLocation = inverseItem.locationProperty.value;
            var parent = self.getParent();
            var itemConstructor = item.constructor;

            // delete the 2 items that sum to zero
            item.dispose();
            inverseItem.dispose();

            // show '0' or '0x' in yellow halo, fade out
            var sumToZeroNode = new SumToZeroNode( itemConstructor, {
              haloRadius: haloRadius,
              centerX: inverseItemLocation.x,
              centerY: inverseItemLocation.y
            } );
            parent.addChild( sumToZeroNode );
            sumToZeroNode.startAnimation();
          }
          else {

            // item was released above the plate, animate to closest empty cell
            self.animateToClosestEmptyCell( item, plate );
          }
        }
        else {

          // item was released above the plate, animate to closest empty cell
          self.animateToClosestEmptyCell( item, plate );
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
     * @param {AbstractItem} item
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
     * Animates an item to an empty cell on the plate.
     * @param {AbstractItem} item
     * @param {Plate} plate
     * @private
     */
    animateToClosestEmptyCell: function( item, plate ) {

      var self = this;

      var cellIndex = plate.getClosestEmptyCell( item.locationProperty.value );
      if ( cellIndex === -1 ) {

        // Plate has become full, or there is no available cell above the item's location.
        // Return the item to panel.
        this.animateToPanel( item );
      }
      else {

        var cellLocation = plate.getLocationForCell( cellIndex );

        item.animateTo( cellLocation, {

          // If the target cell has become occupied, choose another cell.
          animationStepCallback: function() {
            if ( !plate.isEmptyCell( cellIndex ) ) {
              self.animateToClosestEmptyCell( item, plate );
            }
          },

          // When the item reaches the cell, put it in the cell.
          animationCompletedCallback: function() {
            plate.addItem( item, cellIndex );
            self.itemCreator.addItemToScale( item );
          }
        } );
      }
    }
  } );
} );
