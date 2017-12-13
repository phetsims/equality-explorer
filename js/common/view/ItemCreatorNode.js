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

      // If the item was created via user interaction, start a drag cycle by propagating the event to the ItemNode
      if ( event ) {
        itemNode.dragListener.startDrag( event );
      }
    } );

    // On down event, create an item and start a drag cycle
    this.addInputListener( SimpleDragHandler.createForwardingListener(

      // down
      function( event ) {
        var location = itemsLayer.globalToLocalPoint( self.parentToGlobalPoint( self.center ) );
        itemCreator.createItem( location, event );
      }, {
        allowTouchSnag: true
      }
    ) );

    // Enable and disable, unlink unnecessary
    itemCreator.enabledProperty.link( function( enabled ) {
      self.pickable = enabled;
      self.opacity = ( enabled ? 1 : 0.5 );
    } );

    // Populate the scale after the sim is loaded, so that ItemCreatorNodes have valid locations.
    // This feature is for debugging and testing, not intended for production.
    // See https://github.com/phetsims/equality-explorer/issues/8.
    var frameStartedCallback = function() {
      self.populateScale( itemCreator.numberOfItemsOnScale );
      phet.joist.sim.frameStartedEmitter.removeListener( frameStartedCallback );
    };
    phet.joist.sim.frameStartedEmitter.addListener( frameStartedCallback );
  }

  equalityExplorer.register( 'ItemCreatorNode', ItemCreatorNode );

  return inherit( Node, ItemCreatorNode, {

    /**
     * Populates the scale with a specified number of items.
     * This is intended to be used for debugging and testing, not in production situations.
     * ItemCreatorNode uses its location to initialize the location of items that it creates.
     * So this function must be called after the ItemCreatorNode has been added to the scene graph,
     * so that it has a valid location.
     * See https://github.com/phetsims/equality-explorer/issues/8.
     *
     * @param {number} numberOfItems
     * @private
     */
    populateScale: function( numberOfItems ) {

      for ( var i = 0; i < numberOfItems; i++ ) {

        var cellIndex = this.plate.getFirstEmptyCell();
        assert && assert( cellIndex !== -1, 'plate is full, numberOfItems is too large: ' + numberOfItems );

        // create an item
        var location = this.itemsLayer.globalToLocalPoint( this.parentToGlobalPoint( this.center ) );
        var item = this.itemCreator.createItem( location, null );

        // put the item on the scale
        this.plate.addItem( item, cellIndex );
        this.itemCreator.addItemToScale( item );
      }
    }
  } );
} );
