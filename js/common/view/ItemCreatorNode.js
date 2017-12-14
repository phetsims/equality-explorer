// Copyright 2017, University of Colorado Boulder

/**
 * Node that creates items.
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
   * @param {AbstractItemCreator} itemCreator
   * @param {Plate} plate
   * @param {Node} itemsLayer
   * @param {Object} [options]
   * @constructor
   */
  function ItemCreatorNode( itemCreator, plate, itemsLayer, options ) {

    var self = this;

    options = _.extend( {
      cursor: 'pointer'
    }, options );

    assert && assert( !options.children, 'this type defines its children' );
    options.children = [
      itemCreator.icon // careful, itemCreator.icon is using scenery DAG feature
    ];

    // @private
    this.itemCreator = itemCreator;
    this.plate = plate;
    this.itemsLayer = itemsLayer;

    Node.call( this, options );

    // When an item is created in the model, create the corresponding view.
    itemCreator.itemCreatedEmitter.addListener( function( item, event ) {

      // create an ItemNode
      var itemNode = new ItemNode( item, itemCreator, plate );
      itemsLayer.addChild( itemNode );

      // Clean up when the item is disposed. AbstractItem.dispose handles removal of this listener.
      item.disposedEmitter.addListener( function( item ) {
        itemNode.dispose();
      } );

      // If the item was created via user interaction, start a drag cycle by propagating the event to itemNode.
      if ( event ) {
        itemNode.dragListener.startDrag( event );
      }
    } );

    // On down event, create an item and start a drag cycle
    this.addInputListener( SimpleDragHandler.createForwardingListener(

      // down
      function( event ) {
        itemCreator.createItemDragging( event );
      }, {
        allowTouchSnag: true
      }
    ) );

    // Enable and disable, unlink unnecessary
    itemCreator.enabledProperty.link( function( enabled ) {
      self.pickable = enabled;
      self.opacity = ( enabled ? 1 : 0.5 );
    } );

    // Things to do after the sim has loaded, when this Node has a valid location.
    var frameStartedCallback = function() {

      // itemCreator's location
      var location = itemsLayer.globalToLocalPoint( self.parentToGlobalPoint( self.center ) );

      // complete initialization
      itemCreator.initialize( location );

      // Remove this function, so that it's called only once.
      phet.joist.sim.frameStartedEmitter.removeListener( frameStartedCallback );
    };
    phet.joist.sim.frameStartedEmitter.addListener( frameStartedCallback );
  }

  equalityExplorer.register( 'ItemCreatorNode', ItemCreatorNode );

  return inherit( Node, ItemCreatorNode );
} );
