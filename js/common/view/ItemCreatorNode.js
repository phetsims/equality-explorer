// Copyright 2017, University of Colorado Boulder

/**
 * Node that creates Items.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemNode = require( 'EQUALITY_EXPLORER/common/view/ItemNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  /**
   * @param {ItemCreator} itemCreator
   * @param {WeighingPlatform} weighingPlatform
   * @param {Node} itemsLayer
   * @param {Object} [options]
   * @constructor
   */
  function ItemCreatorNode( itemCreator, weighingPlatform, itemsLayer, options ) {

    var self = this;

    options = _.extend( {
      cursor: 'pointer'
    }, options );

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [
      itemCreator.icon // careful, itemCreator.icon is using scenery DAG feature
    ];

    // @private
    this.itemCreator = itemCreator;
    this.weighingPlatform = weighingPlatform;
    this.itemsLayer = itemsLayer;

    Node.call( this, options );

    this.addInputListener( SimpleDragHandler.createForwardingListener(
      // down function, creates model and view for an Item
      function( event ) {

        // create an Item
        var item = itemCreator.createItem( {
          location: itemsLayer.globalToLocalPoint( self.parentToGlobalPoint( self.center ) )
        } );

        // create an ItemNode
        var itemNode = new ItemNode( item, itemCreator, weighingPlatform );
        itemsLayer.addChild( itemNode );

        // Clean up when the Item is disposed. Item.dispose handles removal of this listener.
        item.disposedEmitter.addListener( function( item ) {
          itemNode.dispose();
        } );

        // Propagate drag to the ItemNode
        itemNode.dragListener.startDrag( event );
      }
    ), {
      allowTouchSnag: true
    } );

    // Enable and disable, unlink unnecessary
    itemCreator.enabledProperty.link( function( enabled ) {
      self.pickable = enabled;
      self.opacity = ( enabled ? 1 : 0.5 );
    } );
  }

  equalityExplorer.register( 'ItemCreatorNode', ItemCreatorNode );

  return inherit( Node, ItemCreatorNode, {

    /**
     * Populates the scale with a specified number of Items.
     * This is intended to be used for debugging and testing, not in production situations.
     * It must be called after the ItemCreatorNode has been added to the scene graph.
     * See also the leftItems and rightItems query parameters.
     *
     * @param {number} numberOfItems
     * @public
     */
    populateScale: function( numberOfItems ) {

      for ( var i = 0; i < numberOfItems; i++ ) {

        // create an Item
        var item = this.itemCreator.createItem( {
          location: this.itemsLayer.globalToLocalPoint( this.parentToGlobalPoint( this.center ) )
        } );

        // create an ItemNode
        var itemNode = new ItemNode( item, this.itemCreator, this.weighingPlatform );
        this.itemsLayer.addChild( itemNode );

        // put the Item on the scale
        this.itemCreator.addItemToScale( item );
        var cell = this.weighingPlatform.getFirstEmptyCell();
        this.weighingPlatform.addItem( item, cell );

        // Clean up when the Item is disposed. Item.dispose handles removal of this listener.
        // IFEE creates a closure for itemNode.
        (function( itemNode ) {
          item.disposedEmitter.addListener( function( item ) {
            itemNode.dispose();
          } );
        }( itemNode ));
      }
    }
  } );
} );
