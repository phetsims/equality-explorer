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
   * @param {Node} dragLayer
   * @param {Object} [options]
   * @constructor
   */
  function ItemCreatorNode( itemCreator, weighingPlatform, dragLayer, options ) {

    var self = this;

    options = _.extend( {
      cursor: 'pointer'
    }, options );

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [
      itemCreator.icon // careful, itemCreator.icon is using scenery DAG feature
    ];

    Node.call( this, options );

    this.addInputListener( SimpleDragHandler.createForwardingListener(

      // down function, creates model and view for an Item
      function( event ) {

        // create an Item
        var item = itemCreator.createItem( {
          location: dragLayer.globalToLocalPoint( self.parentToGlobalPoint( self.center ) )
        } );

        // create an ItemNode
        var itemNode = new ItemNode( item, itemCreator, weighingPlatform );
        dragLayer.addChild( itemNode );

        // clean up when the Item is disposed
        var disposedListener = function( item ) {
          item.disposedEmitter.removeListener( disposedListener );
          itemNode.dispose();
        };
        item.disposedEmitter.addListener( disposedListener );

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

  return inherit( Node, ItemCreatorNode );
} );
