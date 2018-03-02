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
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var ReducedFraction = require( 'EQUALITY_EXPLORER/common/model/ReducedFraction' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @param {ReducedFraction} fraction
   * @param {Object} [options]
   * @constructor
   */
  function ReducedFractionNode( fraction, options ) {

    assert && assert( fraction instanceof ReducedFraction, 'invalid fraction' );

    options = _.extend( {
      minLineLength: 1, // length of the fraction line
      fractionFont: new PhetFont( 22 ), // font for numerator and denominator of fraction value
      integerFont: new PhetFont( 40 ), // font for integer value
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

      // fraction
      var numeratorNode = new Text( fraction.numerator, {
        font: options.fractionFont
      } );

      var lineNode = new Line( 0, 0, 1, 0, {
        stroke: options.color,
        lineWidth: options.lineWidth,
        centerX: numeratorNode.centerX,
        top: numeratorNode.bottom + options.ySpacing
      } );

      var denominatorNode = new Text( fraction.denominator, {
        font: options.fractionFont,
        centerX: numeratorNode.centerX,
        top: lineNode.bottom + options.ySpacing
      } );

      var negativeSignNode = new Text( EqualityExplorerConstants.MINUS, {
        font: options.fractionFont,
        right: lineNode.left - options.xSpacing,
        centerY: lineNode.centerY
      } );

      options.children = [ negativeSignNode, numeratorNode, lineNode, denominatorNode ];
    }

    Node.call( this, options );
  }

  equalityExplorer.register( 'ReducedFractionNode', ReducedFractionNode );

  return inherit( Node, ReducedFractionNode );
} );
 