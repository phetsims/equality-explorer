// Copyright 2018, University of Colorado Boulder

/**
 * Displays the icon or symbol that represents a variable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ObjectVariable = require( 'EQUALITY_EXPLORER/basics/model/ObjectVariable' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @param {Variable} variable
   * @param {Object} [options]
   * @constructor
   */
  function VariableNode( variable, options ) {

    options = _.extend( {
      iconScale: 1, // for variables that are displayed as an icon, e.g. apple, cat, coin
      fontSize: 24 // for variables that are displayed as a text symbol, e.g. 'x'
    }, options );

    var symbolNode;
    if ( variable instanceof ObjectVariable ) {

      // use an image for a variable associated with a real-world object
      symbolNode = new Image( variable.image, {
        scale: options.iconScale
      } );
    }
    else {

      // use text for a symbolic variable, e.g 'x'
      symbolNode = new Text( variable.symbol, {
        font: new MathSymbolFont( options.fontSize )
      } );
    }

    assert && assert( !options.children, 'VariableNode sets children' );
    options.children = [ symbolNode ];

    Node.call( this, options );
  }

  equalityExplorer.register( 'VariableNode', VariableNode );

  return inherit( Node, VariableNode );
} );
 