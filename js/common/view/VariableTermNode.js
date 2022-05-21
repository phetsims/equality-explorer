// Copyright 2018-2021, University of Colorado Boulder

/**
 * Displays a variable term.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import MathSymbolFont from '../../../../scenery-phet/js/MathSymbolFont.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox } from '../../../../scenery/js/imports.js';
import { Node } from '../../../../scenery/js/imports.js';
import { Rectangle } from '../../../../scenery/js/imports.js';
import { Text } from '../../../../scenery/js/imports.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerColors from '../EqualityExplorerColors.js';
import EqualityExplorerConstants from '../EqualityExplorerConstants.js';
import ReducedFractionNode from './ReducedFractionNode.js';
import TermNode from './TermNode.js';

// constants
const DEFAULT_OPTIONS = {
  margin: null, // {number|null} margin, determined empirically if null
  positiveFill: EqualityExplorerColors.POSITIVE_X_FILL, // fill of background square for positive coefficient
  negativeFill: EqualityExplorerColors.NEGATIVE_X_FILL, // fill of background square for negative coefficient
  positiveLineDash: [], // solid border for positive coefficient
  negativeLineDash: [ 4, 4 ], // dashed border for negative coefficient
  integerXSpacing: 4, // space between integer coefficient and variable symbol
  fractionXSpacing: 4, // space between fractional coefficient and variable symbol
  integerFont: new PhetFont( 40 ), // font for integer coefficient
  fractionFont: new PhetFont( 20 ), // font for fractional coefficient
  symbolFont: new MathSymbolFont( 40 ), // font for variable symbol
  showOne: false // show 1 or -1 coefficient
};

class VariableTermNode extends TermNode {

  /**
   * @param {TermCreator} termCreator
   * @param {VariableTerm} term
   * @param {Object} [options]
   */
  constructor( termCreator, term, options ) {

    options = merge( {}, DEFAULT_OPTIONS, options );

    const contentNode = VariableTermNode.createInteractiveTermNode( term.coefficient, term.variable.symbol,
      merge( { diameter: term.diameter }, _.pick( options, _.keys( DEFAULT_OPTIONS ) ) ) );

    const shadowNode = new Rectangle( 0, 0, term.diameter, term.diameter, {
      fill: 'black',
      opacity: EqualityExplorerConstants.SHADOW_OPACITY
    } );

    super( termCreator, term, contentNode, shadowNode, options );
  }

  /**
   * Creates the representation of a term that the user interacts with,
   * in this case a coefficient and variable inside a square.
   * @param {Fraction} coefficient
   * @param {string} symbol - the variable's symbol, e.g. 'x'
   * @param {Object} [options] - see DEFAULT_OPTIONS
   * @returns {Node}
   * @public
   * @static
   */
  static createInteractiveTermNode( coefficient, symbol, options ) {

    assert && assert( coefficient instanceof Fraction, `invalid coefficient: ${coefficient}` );
    assert && assert( coefficient.isReduced(), `coefficient must be reduced: ${coefficient}` );
    assert && assert( typeof symbol === 'string', `invalid symbol: ${symbol}` );

    options = merge( {
      diameter: EqualityExplorerConstants.SMALL_TERM_DIAMETER
    }, DEFAULT_OPTIONS, options );

    if ( options.margin === null ) {
      options.margin = 0.12 * options.diameter; // determined empirically
    }

    const isPositive = ( coefficient.getValue() >= 0 );

    // background square
    const squareNode = new Rectangle( 0, 0, options.diameter, options.diameter, {
      stroke: 'black',
      fill: isPositive ? options.positiveFill : options.negativeFill,
      lineDash: isPositive ? options.positiveLineDash : options.negativeLineDash
    } );

    const valueNode = VariableTermNode.createEquationTermNode( coefficient, symbol, merge( {}, options, {
      align: 'center',
      maxWidth: squareNode.width - ( 2 * options.margin ),
      maxHeight: squareNode.height - ( 2 * options.margin ),
      center: squareNode.center
    } ) );

    assert && assert( !options.children, 'VariableTermNode sets children' );
    options.children = [ squareNode, valueNode ];

    return new Node( options );
  }

  /**
   * Creates the representation of a term that is shown in equations.
   * For constant terms, this same representation appears on interactive terms.
   * @param {Fraction} coefficient
   * @param {string} symbol - the variable's symbol, e.g. 'x'
   * @param {Object} [options] - see ReducedFractionNode
   * @returns {Node}
   * @public
   * @static
   */
  static createEquationTermNode( coefficient, symbol, options ) {

    assert && assert( coefficient instanceof Fraction, `invalid coefficient: ${coefficient}` );
    assert && assert( coefficient.isReduced(), `coefficient must be reduced: ${coefficient}` );
    assert && assert( typeof symbol === 'string', `invalid symbol: ${symbol}` );

    options = merge( {
      align: 'center'
    }, DEFAULT_OPTIONS, options );

    assert && assert( !options.children, 'sets its own children' );
    options.children = [];

    // coefficient, with option to show 1 and -1
    if ( options.showOne || coefficient.abs().getValue() !== 1 ) {
      const coefficientNode = new ReducedFractionNode( coefficient, {
        fractionFont: options.fractionFont,
        integerFont: options.integerFont
      } );
      options.children.push( coefficientNode );
    }

    // variable's symbol, with option to show 1 and -1
    const symbolText = ( !options.showOne && coefficient.getValue() === -1 ) ?
                       ( MathSymbols.UNARY_MINUS + symbol ) : symbol;
    const symbolNode = new Text( symbolText, {
      font: options.symbolFont
    } );
    options.children.push( symbolNode );

    assert && assert( options.spacing === undefined, 'VariableTermNode sets spacing' );
    options.spacing = coefficient.isInteger() ? options.integerXSpacing : options.fractionXSpacing;

    return new HBox( _.omit( options, 'margin' ) );
  }
}

equalityExplorer.register( 'VariableTermNode', VariableTermNode );

export default VariableTermNode;