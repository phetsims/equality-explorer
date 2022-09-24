// Copyright 2018-2022, University of Colorado Boulder

/**
 * Displays a reduced fraction.
 * Origin is at the top center of the numerator, to support positioning that is independent of sign.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Font, Line, Node, NodeOptions, NodeTranslationOptions, TColor, Text, VBox } from '../../../../scenery/js/imports.js';
import equalityExplorer from '../../equalityExplorer.js';

// constants
const DEFAULT_FRACTION_FONT = new PhetFont( 22 );
const DEFAULT_INTEGER_FONT = new PhetFont( 40 );

type SelfOptions = {
  minLineLength?: number; // length of the fraction line
  fractionFont?: Font; // font for numerator and denominator of fraction value
  integerFont?: Font; // font for integer value
  color?: TColor; // color of everything
  lineWidth?: number; // for the fraction line
  xSpacing?: number; // horizontal space between negative sign and fraction line
  ySpacing?: number; // vertical spacing above/below the fraction line
};

export type ReducedFractionNodeOptions = SelfOptions & NodeTranslationOptions & PickOptional<NodeOptions, 'maxWidth' | 'maxHeight'>;

export default class ReducedFractionNode extends Node {

  public constructor( fraction: Fraction, providedOptions?: ReducedFractionNodeOptions ) {
    assert && assert( fraction.isReduced(), `fraction must be reduced: ${fraction}` );

    const options = optionize<ReducedFractionNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      minLineLength: 1,
      fractionFont: DEFAULT_FRACTION_FONT,
      integerFont: DEFAULT_INTEGER_FONT,
      color: 'black',
      lineWidth: 1,
      xSpacing: 5,
      ySpacing: 3
    }, providedOptions );

    if ( fraction.isInteger() ) {

      // integer
      const integerText = new Text( fraction.getValue(), {
        font: options.integerFont
      } );

      options.children = [ integerText ];
    }
    else {

      const numeratorText = new Text( Math.abs( fraction.numerator ), {
        font: options.fractionFont
      } );

      const denominatorText = new Text( Math.abs( fraction.denominator ), {
        font: options.fractionFont
      } );

      const lineLength = Math.max( numeratorText.width, denominatorText.width );
      const lineNode = new Line( 0, 0, lineLength, 0, {
        stroke: options.color,
        lineWidth: options.lineWidth
      } );

      const absoluteFractionNode = new VBox( {
        children: [ numeratorText, lineNode, denominatorText ],
        align: 'center',
        spacing: options.ySpacing
      } );

      options.children = [ absoluteFractionNode ];

      // Add sign for negative values
      if ( fraction.getValue() < 0 ) {
        const negativeSignText = new Text( MathSymbols.MINUS, {
          font: options.fractionFont,
          right: lineNode.left - options.xSpacing,
          centerY: lineNode.centerY
        } );
        options.children.push( negativeSignText );
      }
    }

    super( options );
  }
}

equalityExplorer.register( 'ReducedFractionNode', ReducedFractionNode );