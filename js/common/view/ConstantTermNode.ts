// Copyright 2018-2022, University of Colorado Boulder

/**
 * Displays a constant term.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Circle, Node, NodeOptions, TColor } from '../../../../scenery/js/imports.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerColors from '../EqualityExplorerColors.js';
import EqualityExplorerConstants from '../EqualityExplorerConstants.js';
import ConstantTerm from '../model/ConstantTerm.js';
import ConstantTermCreator from '../model/ConstantTermCreator.js';
import ReducedFractionNode, { ReducedFractionNodeOptions } from './ReducedFractionNode.js';
import TermNode, { TermNodeOptions } from './TermNode.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';

type EquationTermNodeSelfOptions = EmptySelfOptions;

type EquationTermNodeOptions = EquationTermNodeSelfOptions &
  PickOptional<ReducedFractionNodeOptions, 'integerFont' | 'fractionFont' | 'maxWidth' | 'maxHeight'>;

type InteractiveTermNodeSelfOptions = {
  diameter?: number;
  margin?: number | null; // margin, determined empirically if null
  positiveFill?: TColor; // fill of background circle for positive coefficient
  negativeFill?: TColor; // fill of background circle for negative coefficient
  positiveLineDash?: number[]; // lineDash for positive coefficient
  negativeLineDash?: number[]; // lineDash for negative coefficient
  equationTermNodeOptions?: EquationTermNodeOptions; // propagated to EquationTermNode
};

type InteractiveTermNodeOptions = InteractiveTermNodeSelfOptions;

type SelfOptions = {
  interactiveTermNodeOptions?: StrictOmit<InteractiveTermNodeOptions, 'diameter'>; // propagated to InteractiveTermNode
};

type ConstantTermNodeOptions = SelfOptions & TermNodeOptions;

export default class ConstantTermNode extends TermNode {

  public constructor( termCreator: ConstantTermCreator, term: ConstantTerm, providedOptions?: ConstantTermNodeOptions ) {

    const options = optionize<ConstantTermNodeOptions, StrictOmit<SelfOptions, 'interactiveTermNodeOptions'>, TermNodeOptions>()( {
      // empty optionize call because we access options.interactiveTermNodeOptions below
    }, providedOptions );

    const contentNode = ConstantTermNode.createInteractiveTermNode( term.constantValue,
      combineOptions<InteractiveTermNodeOptions>( {}, options.interactiveTermNodeOptions, {
        diameter: term.diameter
      } ) );

    const shadowNode = new Circle( term.diameter / 2, {
      fill: 'black',
      opacity: EqualityExplorerConstants.SHADOW_OPACITY
    } );

    super( termCreator, term, contentNode, shadowNode, options );
  }

  /**
   * Creates the representation of a term that the user interacts with.
   */
  public static createInteractiveTermNode( constantValue: Fraction, providedOptions?: InteractiveTermNodeOptions ): Node {
    return new InteractiveTermNode( constantValue, providedOptions ); //TODO https://github.com/phetsims/equality-explorer/issues/200 dynamic
  }

  /**
   * Creates the representation of a term that is shown in equations.
   */
  public static createEquationTermNode( constantValue: Fraction, providedOptions?: EquationTermNodeOptions ): Node {
    return new EquationTermNode( constantValue, providedOptions ); //TODO https://github.com/phetsims/equality-explorer/issues/200 dynamic
  }
}

/**
 * The representation of a term that is shown in equations, a reduced fraction.
 */
class EquationTermNode extends ReducedFractionNode {
  public constructor( constantValue: Fraction, providedOptions?: EquationTermNodeOptions ) {
    assert && assert( constantValue.isReduced(), `constantValue must be reduced: ${constantValue}` );

    const options = optionize<EquationTermNodeOptions, EquationTermNodeSelfOptions, ReducedFractionNodeOptions>()( {

      // ReducedFractionNodeOptions
      integerFont: new PhetFont( 40 ),
      fractionFont: new PhetFont( 20 )
    }, providedOptions );

    super( constantValue, options );
  }
}

/**
 * The representation of a term that the user interacts with, in this case a number inside a circle.
 */
class InteractiveTermNode extends Node {
  public constructor( constantValue: Fraction, providedOptions?: InteractiveTermNodeOptions ) {
    assert && assert( constantValue.isReduced(), `constantValue must be reduced: ${constantValue}` );

    const options = optionize<InteractiveTermNodeOptions, StrictOmit<InteractiveTermNodeSelfOptions, 'equationTermNodeOptions'>, NodeOptions>()( {

      // InteractiveTermNodeSelfOptions
      diameter: EqualityExplorerConstants.SMALL_TERM_DIAMETER,
      margin: 8,
      positiveFill: EqualityExplorerColors.POSITIVE_CONSTANT_FILL,
      negativeFill: EqualityExplorerColors.NEGATIVE_CONSTANT_FILL,
      positiveLineDash: [],
      negativeLineDash: [ 3, 3 ]
    }, providedOptions );

    const isPositive = ( constantValue.getValue() >= 0 );

    // background circle
    const circleNode = new Circle( options.diameter / 2, {
      stroke: 'black',
      fill: isPositive ? options.positiveFill : options.negativeFill,
      lineDash: isPositive ? options.positiveLineDash : options.negativeLineDash
    } );

    // constant value
    const margin = 0.18 * options.diameter; // determined empirically
    const equationTermNode = ConstantTermNode.createEquationTermNode( constantValue,
      combineOptions<EquationTermNodeOptions>( {}, options.equationTermNodeOptions, {
        maxWidth: circleNode.width - ( 2 * margin ),
        maxHeight: circleNode.height - ( 2 * margin )
      } )
    );
    equationTermNode.boundsProperty.link( bounds => {
      equationTermNode.center = circleNode.center;
    } );

    options.children = [ circleNode, equationTermNode ];

    super( options );
  }
}

equalityExplorer.register( 'ConstantTermNode', ConstantTermNode );