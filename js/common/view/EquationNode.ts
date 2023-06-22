// Copyright 2017-2023, University of Colorado Boulder

//TODO https://github.com/phetsims/equality-explorer/issues/202 presentation of equations in Studio and data stream
/**
 * Displays an equation or inequality, possibly involving multiple variables.
 * Origin is at the center of the relational operator, to facilitate horizontal alignment with the scale.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Disposable from '../../../../axon/js/Disposable.js';
import Multilink from '../../../../axon/js/Multilink.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import MathSymbolFont from '../../../../scenery-phet/js/MathSymbolFont.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Font, FontWeight, HBox, Node, NodeOptions, Text } from '../../../../scenery/js/imports.js';
import ObjectTermCreator from '../model/ObjectTermCreator.js';
import ObjectTermNode from './ObjectTermNode.js';
import equalityExplorer from '../../equalityExplorer.js';
import ConstantTermCreator from '../model/ConstantTermCreator.js';
import TermCreator from '../model/TermCreator.js';
import VariableTermCreator from '../model/VariableTermCreator.js';
import ConstantTermNode from './ConstantTermNode.js';
import VariableTermNode from './VariableTermNode.js';
import { RelationalOperator } from '../model/RelationalOperator.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import Tandem from '../../../../tandem/js/Tandem.js';

// constants
const DEFAULT_FONT_SIZE = 30;

type SelfOptions = {

  // Update the view when the model changes? Setting to false creates a static equation.
  updateEnabled?: boolean;

  // fonts sizes, optimized for EquationAccordionBox
  symbolFontSize?: number;
  operatorFontSize?: number;
  integerFontSize?: number;
  fractionFontSize?: number;
  relationalOperatorFontSize?: number;

  relationalOperatorFontWeight?: FontWeight;

  // horizontal spacing
  coefficientSpacing?: number; // space between coefficient and icon
  plusSpacing?: number; // space around plus operator
  relationalOperatorSpacing?: number; // space around the relational operator
};

export type EquationNodeOptions = SelfOptions & PickOptional<NodeOptions, 'pickable' | 'tandem'>;

export default class EquationNode extends Node {

  private readonly leftTermCreators: TermCreator[];
  private readonly rightTermCreators: TermCreator[];
  private readonly relationalOperatorText: Text;
  private readonly relationalOperatorSpacing: number;
  private readonly expressionNodeOptions: ExpressionNodeOptions;

  private leftExpressionNode: Node | null;  // left side of the equation
  private rightExpressionNode: Node | null; // right side of the equation

  /**
   * @param leftTermCreators - left side of equation, terms appear in this order
   * @param rightTermCreators - right side of equation, terms appear in this order
   * @param [providedOptions]
   */
  public constructor( leftTermCreators: TermCreator[], rightTermCreators: TermCreator[],
                      providedOptions?: EquationNodeOptions ) {

    const options = optionize<EquationNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      updateEnabled: true,
      symbolFontSize: DEFAULT_FONT_SIZE,
      operatorFontSize: DEFAULT_FONT_SIZE,
      integerFontSize: DEFAULT_FONT_SIZE,
      fractionFontSize: 0.6 * DEFAULT_FONT_SIZE,
      relationalOperatorFontSize: 1.5 * DEFAULT_FONT_SIZE,
      relationalOperatorFontWeight: 'bold',
      coefficientSpacing: 3,
      plusSpacing: 8,
      relationalOperatorSpacing: 20,

      // NodeOptions
      tandem: Tandem.OPTIONAL,
      phetioVisiblePropertyInstrumented: false
    }, providedOptions );

    super( options );

    this.leftTermCreators = leftTermCreators;
    this.rightTermCreators = rightTermCreators;

    this.relationalOperatorSpacing = options.relationalOperatorSpacing;

    // expressions for the left and right sides of the equation
    this.leftExpressionNode = null;
    this.rightExpressionNode = null;

    // relational operator that separates the two expressions
    this.relationalOperatorText = new Text( '?', {
      font: new PhetFont( {
        size: options.relationalOperatorFontSize,
        weight: options.relationalOperatorFontWeight
      } )
    } );

    // information for one side of the equation, passed to createExpressionNode
    this.expressionNodeOptions = {
      symbolFont: new MathSymbolFont( options.symbolFontSize ),
      operatorFont: new PhetFont( options.operatorFontSize ),
      integerFont: new PhetFont( options.integerFontSize ),
      fractionFont: new PhetFont( options.fractionFontSize ),
      coefficientSpacing: options.coefficientSpacing,
      plusSpacing: options.plusSpacing
    };

    if ( options.updateEnabled ) {

      // The equation needs to be dynamically updated.
      const allTermCreators = leftTermCreators.concat( rightTermCreators );

      // Update the relational operator when weight on either plate changes.
      Multilink.multilinkAny(
        allTermCreators.map( termCreator => termCreator.weightOnPlateProperty ),
        () => this.updateRelationalOperator()
      );

      // Update the expressions number of terms on either plate changes.
      Multilink.multilinkAny(
        allTermCreators.map( termCreator => termCreator.numberOfTermsOnPlateProperty ),
        () => this.updateExpressions()
      );
    }
    else {
      this.update();
    }
  }

  public override dispose(): void {
    Disposable.assertNotDisposable();
    super.dispose();
  }

  /**
   * Use this to update a static equation that was created with updateEnabled: false.
   */
  public update(): void {
    this.updateRelationalOperator();
    this.updateExpressions();
  }

  /**
   * Updates the equation's left and right expressions, on either side of the relational operator.
   */
  private updateExpressions(): void {

    // Existing expressions may be linked to translated StringProperties, so they must be disposed.
    this.leftExpressionNode && this.leftExpressionNode.dispose();
    this.rightExpressionNode && this.rightExpressionNode.dispose();

    // Create new expressions.
    this.leftExpressionNode = new ExpressionNode( this.leftTermCreators, this.expressionNodeOptions );
    this.rightExpressionNode = new ExpressionNode( this.rightTermCreators, this.expressionNodeOptions );
    this.children = [ this.leftExpressionNode, this.relationalOperatorText, this.rightExpressionNode ];
    this.updateLayout();
  }

  /**
   * Updates the relational operator, based on left vs right weight.
   */
  private updateRelationalOperator(): void {
    this.relationalOperatorText.string = getRelationalOperator( this.leftTermCreators, this.rightTermCreators );
    this.updateLayout();
  }

  /**
   * Updates the equation's layout. Origin must be at the center of the relational operator, so that we
   * can align the equation properly above the balance scale.
   */
  private updateLayout(): void {
    if ( this.leftExpressionNode && this.rightExpressionNode ) {
      this.relationalOperatorText.centerX = 0;
      this.relationalOperatorText.centerY = 0;
      this.leftExpressionNode.right = this.relationalOperatorText.left - this.relationalOperatorSpacing;
      this.leftExpressionNode.centerY = this.relationalOperatorText.centerY;
      this.rightExpressionNode.left = this.relationalOperatorText.right + this.relationalOperatorSpacing;
      this.rightExpressionNode.centerY = this.relationalOperatorText.centerY;
    }
  }
}

/**
 * Gets the operator that describes the relationship between the left and right sides.
 */
function getRelationalOperator( leftTermCreators: TermCreator[], rightTermCreators: TermCreator[] ): RelationalOperator {

  // evaluate the left side
  let leftWeight = Fraction.fromInteger( 0 );
  for ( let i = 0; i < leftTermCreators.length; i++ ) {
    leftWeight = leftWeight.plus( leftTermCreators[ i ].weightOnPlateProperty.value );
  }

  // evaluate the right side
  let rightWeight = Fraction.fromInteger( 0 );
  for ( let i = 0; i < rightTermCreators.length; i++ ) {
    rightWeight = rightWeight.plus( rightTermCreators[ i ].weightOnPlateProperty.value );
  }

  // determine the operator that describes the relationship between left and right sides
  let relationalOperator: RelationalOperator;
  if ( leftWeight.isLessThan( rightWeight ) ) {
    relationalOperator = MathSymbols.LESS_THAN;
  }
  else if ( rightWeight.isLessThan( leftWeight ) ) {
    relationalOperator = MathSymbols.GREATER_THAN;
  }
  else {
    relationalOperator = MathSymbols.EQUAL_TO;
  }

  return relationalOperator;
}

type ExpressionNodeOptions = {
  symbolFont: Font;
  operatorFont: Font;
  integerFont: Font;
  fractionFont: Font;
  coefficientSpacing: number;
  plusSpacing: number;
};

/**
 * An expression is one side of the equation.
 */
class ExpressionNode extends HBox {

  private readonly disposeExpressionNode: () => void;

  public constructor( termCreators: TermCreator[], providedOptions: ExpressionNodeOptions ) {

    const children: Node[] = [];
    const childrenToDispose: Node[] = [];
    for ( let i = 0; i < termCreators.length; i++ ) {

      const termCreator = termCreators[ i ];

      const numberOfTermsOnPlate = termCreator.numberOfTermsOnPlateProperty.value;
      if ( numberOfTermsOnPlate > 0 ) {

        if ( termCreator instanceof ObjectTermCreator ) {

          // if there were previous terms, add an operator
          if ( children.length > 0 ) {
            children.push( valueToOperatorText( numberOfTermsOnPlate, providedOptions.operatorFont ) );
          }

          // Each ObjectTerm has an implicit coefficient of 1, so use the number of terms as the coefficient.
          children.push( ObjectTermNode.createEquationTermNode( numberOfTermsOnPlate, termCreator.createIcon(), {
            font: providedOptions.integerFont,
            spacing: providedOptions.coefficientSpacing
          } ) );
        }
        else if ( termCreator instanceof VariableTermCreator ) {

          let coefficient = termCreator.sumCoefficientsOnPlate();

          if ( coefficient.getValue() !== 0 ) {

            // if there were previous terms, replace the coefficient's sign with an operator
            if ( children.length > 0 ) {
              children.push( valueToOperatorText( coefficient.getValue(), providedOptions.operatorFont ) );
              coefficient = coefficient.abs();
            }

            const variable = termCreator.variable!;
            assert && assert( variable );

            // Must be disposed because it links to a translated StringProperty.
            const equationTermNode = VariableTermNode.createEquationTermNode( coefficient, variable.symbolProperty, {
              integerFont: providedOptions.integerFont,
              fractionFont: providedOptions.fractionFont,
              symbolFont: providedOptions.symbolFont
            } );

            children.push( equationTermNode );
            childrenToDispose.push( equationTermNode );
          }
        }
        else if ( termCreator instanceof ConstantTermCreator ) {

          let constantValue = termCreator.sumConstantsOnPlate();

          if ( constantValue.getValue() !== 0 ) {

            // if there were previous terms, replace the constant's sign with an operator
            if ( children.length > 0 ) {
              children.push( valueToOperatorText( constantValue.getValue(), providedOptions.operatorFont ) );
              constantValue = constantValue.abs();
            }

            children.push( ConstantTermNode.createEquationTermNode( constantValue, {
              integerFont: providedOptions.integerFont,
              fractionFont: providedOptions.fractionFont
            } ) );
          }
        }
        else {
          throw new Error( `unsupported termCreator: ${termCreator}` );
        }
      }
    }

    // if there were no terms, then this side of the equation evaluated to zero
    if ( children.length === 0 ) {
      children.push( new Text( '0', { font: providedOptions.integerFont } ) );
    }

    super( {
      spacing: providedOptions.plusSpacing,
      children: children
    } );

    this.disposeExpressionNode = () => {
      childrenToDispose.forEach( node => node.dispose() );
    };
  }

  public override dispose(): void {
    this.disposeExpressionNode();
    super.dispose();
  }
}

/**
 * Given the value that determines a term's sign, create the corresponding operator node.
 */
function valueToOperatorText( value: number, operatorFont: Font ): Node {
  const operator = ( value > 0 ) ? MathSymbols.PLUS : MathSymbols.MINUS;
  return new Text( operator, { font: operatorFont } );
}

equalityExplorer.register( 'EquationNode', EquationNode );