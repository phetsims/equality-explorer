// Copyright 2018, University of Colorado Boulder

/**
 * Displays a reduced fraction.
 * Origin is at the top center of the numerator, to support positioning that is independent of sign.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var ReducedFraction = require( 'EQUALITY_EXPLORER/common/model/ReducedFraction' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  var DEFAULT_FRACTION_FONT = new PhetFont( 22 );
  var DEFAULT_INTEGER_FONT = new PhetFont( 40 );

  /**
   * @param {ReducedFraction} fraction
   * @param {Object} [options]
   * @constructor
   */
  function ReducedFractionNode( fraction, options ) {

    assert && assert( fraction instanceof ReducedFraction, 'invalid fraction: ' + fraction );

    options = _.extend( {
      minLineLength: 1, // length of the fraction line
      fractionFont: DEFAULT_FRACTION_FONT, // font for numerator and denominator of fraction value
      integerFont: DEFAULT_INTEGER_FONT, // font for integer value
      color: 'black', // color of everything
      lineWidth: 1, // for the fraction line
      xSpacing: 5, // horizontal space between negative sign and fraction line
      ySpacing: 3 // vertical spacing above/below the fraction line
    }, options );

    assert && assert( !options.children, 'children is set by this Node' );

    if ( fraction.isInteger() ) {

      // integer
      var integerNode = new Text( fraction.toDecimal(), {
        font: options.integerFont
      } );

      options.children = [ integerNode ];
    }
    else {

      var numeratorNode = new Text( Math.abs( fraction.numerator ), {
        font: options.fractionFont
      } );

      var denominatorNode = new Text( Math.abs( fraction.denominator ), {
        font: options.fractionFont
      } );

      var lineLength = Math.max( numeratorNode.width, denominatorNode.width );
      var lineNode = new Line( 0, 0, lineLength, 0, {
        stroke: options.color,
        lineWidth: options.lineWidth
      } );
      
      var absoluteFractionNode = new VBox( {
        children: [ numeratorNode, lineNode, denominatorNode ],
        align: 'center',
        spacing: options.ySpacing
      } );

      options.children = [ absoluteFractionNode ];

      // Add sign for negative values
      if ( fraction.toDecimal() < 0 ) {
        var negativeSignNode = new Text( MathSymbols.MINUS, {
          font: options.fractionFont,
          right: lineNode.left - options.xSpacing,
          centerY: lineNode.centerY
        } );
        options.children.push( negativeSignNode );
      }
    }

    Node.call( this, options );
  }

  equalityExplorer.register( 'ReducedFractionNode', ReducedFractionNode );

  return inherit( Node, ReducedFractionNode );
} );
 