// Copyright 2018-2025, University of Colorado Boulder

/**
 * Displays a variable term.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import MathSymbolFont from '../../../../scenery-phet/js/MathSymbolFont.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox, { HBoxOptions } from '../../../../scenery/js/layout/nodes/HBox.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Font from '../../../../scenery/js/util/Font.js';
import TColor from '../../../../scenery/js/util/TColor.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerColors from '../EqualityExplorerColors.js';
import EqualityExplorerConstants from '../EqualityExplorerConstants.js';
import VariableTerm from '../model/VariableTerm.js';
import VariableTermCreator from '../model/VariableTermCreator.js';
import ReducedFractionNode from './ReducedFractionNode.js';
import TermNode, { TermNodeOptions } from './TermNode.js';

type EquationTermNodeSelfOptions = {
  integerXSpacing?: number; // space between integer coefficient and variable symbol
  fractionXSpacing?: number; // space between fractional coefficient and variable symbol
  integerFont?: Font; // font for integer coefficient
  fractionFont?: Font; // font for fractional coefficient
  symbolFont?: MathSymbolFont; // font for variable symbol
  showOne?: boolean; // true will show 1 and -1 coefficients
};

type EquationTermNodeOptions = EquationTermNodeSelfOptions &
  PickOptional<HBoxOptions, 'align' | 'maxWidth' | 'maxHeight'>;

type InteractiveTermNodeSelfOptions = {
  diameter?: number;
  margin?: number | null; // margin, determined empirically if null
  positiveFill?: TColor; // fill of background square for positive coefficient
  negativeFill?: TColor; // fill of background square for negative coefficient
  positiveLineDash?: number[]; // lineDash for positive coefficient
  negativeLineDash?: number[]; // lineDash for negative coefficient
  equationTermNodeOptions?: EquationTermNodeOptions; // propagated to EquationTermNode
};

type InteractiveTermNodeOptions = InteractiveTermNodeSelfOptions &
  StrictOmit<NodeOptions, 'children' | 'maxWidth' | 'maxHeight'>;

type SelfOptions = {
  interactiveTermNodeOptions?: StrictOmit<InteractiveTermNodeOptions, 'diameter'>; // propagated to InteractiveTermNode
};

type VariableTermNodeOptions = SelfOptions & TermNodeOptions;

export default class VariableTermNode extends TermNode {

  private readonly disposeVariableTermNode: () => void;

  public constructor( termCreator: VariableTermCreator, term: VariableTerm, providedOptions?: VariableTermNodeOptions ) {

    const options = optionize<VariableTermNodeOptions, StrictOmit<SelfOptions, 'interactiveTermNodeOptions'>, TermNodeOptions>()( {
      // empty optionize call because we access options.interactiveTermNodeOptions below
    }, providedOptions );

    // contentNode must be disposed!
    const contentNode = VariableTermNode.createInteractiveTermNode( term.coefficient, term.variable.symbolProperty,
      combineOptions<InteractiveTermNodeOptions>( {}, options.interactiveTermNodeOptions, {
        diameter: term.diameter
      } ) );

    const shadowNode = new Rectangle( 0, 0, term.diameter, term.diameter, {
      fill: 'black',
      opacity: EqualityExplorerConstants.SHADOW_OPACITY
    } );

    super( termCreator, term, contentNode, shadowNode, options );

    this.disposeVariableTermNode = () => {
      contentNode.dispose();
    };
  }

  public override dispose(): void {
    this.disposeVariableTermNode();
    super.dispose();
  }

  /**
   * Creates the representation of a term that the user interacts with,
   */
  public static createInteractiveTermNode( coefficient: Fraction, symbolProperty: TReadOnlyProperty<string>,
                                           providedOptions?: InteractiveTermNodeOptions ): Node {
    //TODO https://github.com/phetsims/equality-explorer/issues/200 PhET-iO dynamic element
    return new InteractiveTermNode( coefficient, symbolProperty, providedOptions );
  }

  /**
   * Creates the representation of a term that is shown in equations.
   */
  public static createEquationTermNode( coefficient: Fraction, symbolProperty: TReadOnlyProperty<string>,
                                        providedOptions?: EquationTermNodeOptions ): Node {
    //TODO https://github.com/phetsims/equality-explorer/issues/200 PhET-iO dynamic element
    return new EquationTermNode( coefficient, symbolProperty, providedOptions );
  }
}

/**
 * The representation of a term that is shown in equations, a coefficient and variable.
 */
class EquationTermNode extends HBox {

  private readonly disposeEquationTermNode: () => void;

  public constructor( coefficient: Fraction, symbolProperty: TReadOnlyProperty<string>, providedOptions?: EquationTermNodeOptions ) {

    assert && assert( coefficient.isReduced(), `coefficient must be reduced: ${coefficient}` );

    const options = optionize<EquationTermNodeOptions, EquationTermNodeSelfOptions, HBoxOptions>()( {
      
      // EquationTermNodeSelfOptions
      integerXSpacing: 4,
      fractionXSpacing: 4,
      integerFont: new PhetFont( 40 ),
      fractionFont: new PhetFont( 20 ),
      symbolFont: new MathSymbolFont( 40 ),
      showOne: false, // do not show 1 and -1 coefficients
      
      // HBoxOptions
      align: 'center'
    }, providedOptions );

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
    const stringProperty = new DerivedProperty( [ symbolProperty ],
      symbol => ( !options.showOne && coefficient.getValue() === -1 ) ? ( MathSymbols.UNARY_MINUS + symbol ) : symbol );
    const symbolText = new Text( stringProperty, {
      font: options.symbolFont
    } );
    options.children.push( symbolText );

    options.spacing = coefficient.isInteger() ? options.integerXSpacing : options.fractionXSpacing;

    super( options );

    this.disposeEquationTermNode = () => {
      stringProperty.dispose();
      symbolText.dispose();
    };
  }

  public override dispose(): void {
    this.disposeEquationTermNode();
    super.dispose();
  }
}

/**
 * The representation of a term that the user interacts with, in this case a coefficient and variable inside a square.
 */
class InteractiveTermNode extends Node {

  private readonly disposeInteractiveTermNode: () => void;

  public constructor( coefficient: Fraction, symbolProperty: TReadOnlyProperty<string>, providedOptions?: InteractiveTermNodeOptions ) {

    assert && assert( coefficient.isReduced(), `coefficient must be reduced: ${coefficient}` );

    const options = optionize<InteractiveTermNodeOptions, StrictOmit<InteractiveTermNodeSelfOptions, 'equationTermNodeOptions'>, NodeOptions>()( {
      
      // InteractiveTermNodeSelfOptions
      diameter: EqualityExplorerConstants.SMALL_TERM_DIAMETER,
      margin: null,
      positiveFill: EqualityExplorerColors.POSITIVE_X_FILL,
      negativeFill: EqualityExplorerColors.NEGATIVE_X_FILL,
      positiveLineDash: [], // solid border for positive coefficient
      negativeLineDash: [ 4, 4 ] // dashed border for negative coefficient
    }, providedOptions );

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

    // equationTermNode must be disposed, because it is linked to a translated string Property
    const equationTermNode = VariableTermNode.createEquationTermNode( coefficient, symbolProperty,
      combineOptions<EquationTermNodeOptions>( {}, options.equationTermNodeOptions, {
        align: 'center',
        maxWidth: squareNode.width - ( 2 * options.margin ),
        maxHeight: squareNode.height - ( 2 * options.margin )
      } )
    );
    equationTermNode.boundsProperty.link( bounds => {
      equationTermNode.center = squareNode.center;
    } );

    options.children = [ squareNode, equationTermNode ];

    super( options );

    this.disposeInteractiveTermNode = () => {
      equationTermNode.dispose();
    };
  }

  public override dispose(): void {
    this.disposeInteractiveTermNode();
    super.dispose();
  }
}

equalityExplorer.register( 'VariableTermNode', VariableTermNode );