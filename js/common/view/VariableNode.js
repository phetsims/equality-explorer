// Copyright 2017, University of Colorado Boulder

/**
 * Displays a variable in a square.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @param {string} symbol - the symbol that represents the variable, e.g. 'x'
   * @param {Object} {options}
   * @constructor
   */
  function VariableNode( symbol, options ) {

    options = _.extend( {
      squareLength: 40,
      margin: 6,
      fill: 'white',
      stroke: 'black',
      lineDash: [],
      textFill: 'black',
      font: new MathSymbolFont( EqualityExplorerConstants.ITEM_FONT_SIZE )
    }, options );

    var squareNode = new Rectangle( 0, 0, options.squareLength, options.squareLength, {
      fill: options.fill,
      stroke: options.stroke,
      lineDash: options.lineDash
    } );

    var textNode = new Text( symbol, {
      font: options.font,
      fill: options.textFill,
      maxWidth: squareNode.width - ( 2 * options.margin ),
      maxHeight: squareNode.height - ( 2 * options.margin ),
      center: squareNode.center
    } );

    assert && assert( !options.children, 'this type defines its children' );
    options.children = [ squareNode, textNode ];

    Node.call( this, options );
  }

  equalityExplorer.register( 'VariableNode', VariableNode );

  return inherit( Node, VariableNode );
} );
