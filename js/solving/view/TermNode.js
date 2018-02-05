// Copyright 2018, University of Colorado Boulder

//TODO add shadow, drag listener, halo -- this will end up being almost identical to ItemNode
/**
 * Base type for displaying a term.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  /**
   * @param {Term} term
   * @param {Object} [options]
   * @constructor
   */
  function TermNode( term, options ) {

    var self = this;

    Node.call( this, options );

    // model controls location of this Node
    var locationObserver = function( location ) {
      self.center = location;
    };
    term.locationProperty.link( locationObserver ); // unlink required

    // @private
    this.disposeTermNode = function() {
      term.locationProperty.unlink( locationObserver );
    };
  }

  equalityExplorer.register( 'TermNode', TermNode );

  return inherit( Node, TermNode, {

    /**
     * @public
     * @override
     */
    dispose: function() {
      this.disposeTermNode();
      Node.prototype.dispose.call( this );
    }
  } );
} );