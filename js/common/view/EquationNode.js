// Copyright 2017, University of Colorado Boulder

/**
 * Displays an equation or inequality.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function EquationNode( options ) {

    options = options || {};

    //TODO placeholder
    var textNode = new Text( '2x + 2 = 6', {
      font: new PhetFont( 35 )
    } );

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [ textNode ];

    Node.call( this, options );
  }

  equalityExplorer.register( 'EquationNode', EquationNode );

  return inherit( Node, EquationNode );
} );
