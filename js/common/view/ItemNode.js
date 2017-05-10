// Copyright 2017, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  /**
   * @param {Item} item
   * @param {Node} icon
   * @param {Object} [options]
   * @constructor
   */
  function ItemNode( item, icon, options ) {

    options = options || {};

    var self = this;

    // @public (read-only)
    this.item = item;

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [ icon ];

    Node.call( this, options );

    // synchronize location with model
    var locationObserver = function( location ) {
      self.center = location;
    };
    item.locationProperty.link( locationObserver ); // unlink in dispose

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
    }
  } );
} );
