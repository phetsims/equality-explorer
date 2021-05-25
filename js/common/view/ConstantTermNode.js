// Copyright 2018-2021, University of Colorado Boulder

/**
 * Displays a constant term.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerColors from '../EqualityExplorerColors.js';
import EqualityExplorerConstants from '../EqualityExplorerConstants.js';
import ReducedFractionNode from './ReducedFractionNode.js';
import TermNode from './TermNode.js';

// constants
const DEFAULT_OPTIONS = {
  positiveFill: EqualityExplorerColors.POSITIVE_CONSTANT_FILL, // fill of background circle for positive coefficient
  negativeFill: EqualityExplorerColors.NEGATIVE_CONSTANT_FILL, // fill of background circle for negative coefficient
  positiveLineDash: [], // solid border for positive coefficient
  negativeLineDash: [ 3, 3 ], // dashed border for negative coefficient
  margin: 8, // margin inside the background circle
  integerFont: new PhetFont( 40 ), // font for integer constant value
  fractionFont: new PhetFont( 20 ) // font for fractional constant value
};

class ConstantTermNode extends TermNode {

  /**
   * @param {ConstantTermCreator} termCreator
   * @param {ConstantTerm} term
   * @param {Object} [options]
   */
  constructor( termCreator, term, options ) {

    options = merge( {}, DEFAULT_OPTIONS, options );

    const contentNode = ConstantTermNode.createInteractiveTermNode( term.constantValue,
      merge( { diameter: term.diameter }, _.pick( options, _.keys( DEFAULT_OPTIONS ) ) ) );

    const shadowNode = new Circle( term.diameter / 2, {
      fill: 'black',
      opacity: EqualityExplorerConstants.SHADOW_OPACITY
    } );

    super( termCreator, term, contentNode, shadowNode, options );
  }

  /**
   * Creates the representation of a term that the user interacts with, in this case a number inside a circle.
   * @param {Fraction} constantValue - value shown on the icon
   * @param {Object} [options] - see DEFAULT_OPTIONS
   * @returns {Node}
   * @public
   * @static
   */
  static createInteractiveTermNode( constantValue, options ) {

    assert && assert( constantValue instanceof Fraction, `invalid constantValue: ${constantValue}` );
    assert && assert( constantValue.isReduced(), `constantValue must be reduced: ${constantValue}` );

    options = merge( {
      diameter: EqualityExplorerConstants.SMALL_TERM_DIAMETER
    }, DEFAULT_OPTIONS, options );

    const isPositive = ( constantValue.getValue() >= 0 );

    // background circle
    const circleNode = new Circle( options.diameter / 2, {
      stroke: 'black',
      fill: isPositive ? options.positiveFill : options.negativeFill,
      lineDash: isPositive ? options.positiveLineDash : options.negativeLineDash
    } );

    // constant value
    const margin = 0.18 * options.diameter; // determined empirically
    const constantNode = ConstantTermNode.createEquationTermNode( constantValue, {
      fractionFont: options.fractionFont,
      integerFont: options.integerFont,
      maxWidth: circleNode.width - ( 2 * margin ),
      maxHeight: circleNode.height - ( 2 * margin ),
      center: circleNode.center
    } );

    return new Node( {
      children: [ circleNode, constantNode ]
    } );
  }

  /**
   * Creates the representation of a term that is shown in equations.
   * For constant terms, this same representation appears on interactive terms.
   * @param {Fraction} constantValue
   * @param {Object} [options] - see ReducedFractionNode
   * @returns {Node}
   * @public
   * @static
   */
  static createEquationTermNode( constantValue, options ) {
    assert && assert( constantValue instanceof Fraction, `invalid constantValue: ${constantValue}` );
    assert && assert( constantValue.isReduced(), `constantValue must be reduced: ${constantValue}` );
    return new ReducedFractionNode( constantValue, options );
  }
}

equalityExplorer.register( 'ConstantTermNode', ConstantTermNode );

export default ConstantTermNode;