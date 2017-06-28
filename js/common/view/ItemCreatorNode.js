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

  /**
   * @param {ItemCreator} itemCreator
   * @param {Node} dragLayer
   * @param {Object} [options]
   * @constructor
   */
  function ItemCreatorNode( itemCreator, dragLayer, options ) {

    var self = this;

    options = _.extend( {
      cursor: 'pointer'
    }, options );

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [ itemCreator.icon ];

    Node.call( this, options );

    this.addInputListener( {
      down: function( event ) {

        // Don't try to start drags with a right mouse button or an attached pointer.
        if ( !event.canStartPress() ) { return; }

        // create an Item
        var item = itemCreator.createItem( {
          location: dragLayer.globalToLocalPoint( self.parentToGlobalPoint( self.center ) )
        } );

        // move slightly above the ItemCreatorNode
        item.locationProperty.value = item.locationProperty.value.plusXY( 0, -5 );

        // create an ItemNode
        var itemNode = new ItemNode( item );

        // add ItemNode to scenegraph
        dragLayer.addChild( itemNode );

        // Propagate drag to the ItemNode
        itemNode.startDrag( event );
      }
    } );

    // Enable and disable
    itemCreator.enabledProperty.link( function( enabled ) {
      self.pickable = enabled;
      self.opacity = ( enabled ? 1 : 0.5 );
    } );
  }

  equalityExplorer.register( 'ItemCreatorNode', ItemCreatorNode );

  return inherit( Node, ItemCreatorNode );
} );
