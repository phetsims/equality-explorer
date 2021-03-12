// Copyright 2018-2020, University of Colorado Boulder

/**
 * Displays a reduced fraction.
 * Origin is at the top center of the numerator, to support positioning that is independent of sign.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import equalityExplorer from '../../equalityExplorer.js';

// constants
const DEFAULT_FRACTION_FONT = new PhetFont( 22 );
const DEFAULT_INTEGER_FONT = new PhetFont( 40 );

class ReducedFractionNode extends Node {

  /**
   * @param {Fraction} fraction
   * @param {Object} [options]
   */
  constructor( fraction, options ) {

    assert && assert( fraction instanceof Fraction, `invalid fraction: ${fraction}` );
    assert && assert( fraction.isReduced(), `fraction must be reduced: ${fraction}` );

    options = merge( {
      minLineLength: 1, // length of the fraction line
      fractionFont: DEFAULT_FRACTION_FONT, // font for numerator and denominator of fraction value
      integerFont: DEFAULT_INTEGER_FONT, // font for integer value
      color: 'black', // color of everything
      lineWidth: 1, // for the fraction line
      xSpacing: 5, // horizontal space between negative sign and fraction line
      ySpacing: 3 // vertical spacing above/below the fraction line
    }, options );

    assert && assert( !options.children, 'ReducedFractionNode sets children' );

    if ( fraction.isInteger() ) {

      // integer
      const integerNode = new Text( fraction.getValue(), {
        font: options.integerFont
      } );

      options.children = [ integerNode ];
    }
    else {

      const numeratorNode = new Text( Math.abs( fraction.numerator ), {
        font: options.fractionFont
      } );

      const denominatorNode = new Text( Math.abs( fraction.denominator ), {
        font: options.fractionFont
      } );

      const lineLength = Math.max( numeratorNode.width, denominatorNode.width );
      const lineNode = new Line( 0, 0, lineLength, 0, {
        stroke: options.color,
        lineWidth: options.lineWidth
      } );

      const absoluteFractionNode = new VBox( {
        children: [ numeratorNode, lineNode, denominatorNode ],
        align: 'center',
        spacing: options.ySpacing
      } );

      options.children = [ absoluteFractionNode ];

      // Add sign for negative values
      if ( fraction.getValue() < 0 ) {
        const negativeSignNode = new Text( MathSymbols.MINUS, {
          font: options.fractionFont,
          right: lineNode.left - options.xSpacing,
          centerY: lineNode.centerY
        } );
        options.children.push( negativeSignNode );
      }
    }

    super( options );
  }
}

equalityExplorer.register( 'ReducedFractionNode', ReducedFractionNode );

export default ReducedFractionNode;