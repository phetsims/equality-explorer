// Copyright 2017-2022, University of Colorado Boulder

/**
 * Displays an equation or inequality, possibly involving multiple variables.
 * Origin is at the center of the relational operator, to facilitate horizontal alignment with the scale.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink, { UnknownMultilink } from '../../../../axon/js/Multilink.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import MathSymbolFont from '../../../../scenery-phet/js/MathSymbolFont.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Font, FontWeight, HBox, Node, NodeOptions, Text } from '../../../../scenery/js/imports.js';
import ObjectTermCreator from '../../basics/model/ObjectTermCreator.js';
import ObjectTermNode from '../../basics/view/ObjectTermNode.js';
import equalityExplorer from '../../equalityExplorer.js';
import ConstantTermCreator from '../model/ConstantTermCreator.js';
import TermCreator from '../model/TermCreator.js';
import VariableTermCreator from '../model/VariableTermCreator.js';
import ConstantTermNode from './ConstantTermNode.js';
import VariableTermNode from './VariableTermNode.js';
import { RelationalOperator } from '../model/RelationalOperator.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';

// constants
const DEFAULT_FONT_SIZE = 30;

type SelfOptions = {

  // Update the view when the model changes? Set this to false to create a static equation.
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

export type EquationNodeOptions = SelfOptions & PickOptional<NodeOptions, 'pickable'>;

export default class EquationNode extends Node {

  private readonly disposeEquationNode: () => void;

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
      relationalOperatorSpacing: 20
    }, providedOptions );

    super();

    // expressions for the left and right sides of the equation
    let leftExpressionNode: Node;
    let rightExpressionNode: Node;

    // relational operator that separates the two expressions
    const relationalOperatorNode = new Text( '?', {
      font: new PhetFont( {
        size: options.relationalOperatorFontSize,
        weight: options.relationalOperatorFontWeight
      } )
    } );

    // updates the equation's layout, origin at the center of the relational operator
    const updateLayout = () => {
      if ( leftExpressionNode && rightExpressionNode ) {
        relationalOperatorNode.centerX = 0;
        relationalOperatorNode.centerY = 0;
        leftExpressionNode.right = relationalOperatorNode.left - options.relationalOperatorSpacing;
        leftExpressionNode.centerY = relationalOperatorNode.centerY;
        rightExpressionNode.left = relationalOperatorNode.right + options.relationalOperatorSpacing;
        rightExpressionNode.centerY = relationalOperatorNode.centerY;
      }
    };

    // updates the relational operator based on left vs right weight
    const updateRelationalOperator = () => {
      relationalOperatorNode.text = getRelationalOperator( leftTermCreators, rightTermCreators );
      updateLayout();
    };

    // information for one side of the equation, passed to createExpressionNode
    const expressionNodeOptions: ExpressionNodeOptions = {
      symbolFont: new MathSymbolFont( options.symbolFontSize ),
      operatorFont: new PhetFont( options.operatorFontSize ),
      integerFont: new PhetFont( options.integerFontSize ),
      fractionFont: new PhetFont( options.fractionFontSize ),
      coefficientSpacing: options.coefficientSpacing,
      plusSpacing: options.plusSpacing
    };

    // updates the equation's terms
    const updateTerms = () => {

      // Expressions may be linked to translated StringProperties, so they must be disposed.
      leftExpressionNode && leftExpressionNode.dispose();
      rightExpressionNode && rightExpressionNode.dispose();

      leftExpressionNode = new ExpressionNode( leftTermCreators, expressionNodeOptions );
      rightExpressionNode = new ExpressionNode( rightTermCreators, expressionNodeOptions );
      this.children = [ leftExpressionNode, relationalOperatorNode, rightExpressionNode ];
      updateLayout();
    };

    let relationalOperatorMultilink: UnknownMultilink | undefined; // defined for dynamic equations
    let termsMultilink: UnknownMultilink | undefined; // defined for dynamic equations
    if ( options.updateEnabled ) {

      // The equation needs to be dynamically updated.

      // {Property[]} dependencies that require the relational operator to be updated
      const relationalOperatorDependencies: TReadOnlyProperty<Fraction>[] = [];

      // {Property[]} dependencies that require the terms to be updated
      const termDependencies: TReadOnlyProperty<number>[] = [];

      // Gather dependencies for all term creators...
      leftTermCreators.concat( rightTermCreators ).forEach( termCreator => {
        relationalOperatorDependencies.push( termCreator.weightOnPlateProperty );
        termDependencies.push( termCreator.numberOfTermsOnPlateProperty );
      } );

      // dispose required
      relationalOperatorMultilink = Multilink.multilinkAny( relationalOperatorDependencies, updateRelationalOperator );
      termsMultilink = Multilink.multilinkAny( termDependencies, updateTerms );
    }
    else {

      // static equation
      updateRelationalOperator();
      updateTerms();
    }

    this.disposeEquationNode = () => {
      relationalOperatorMultilink && relationalOperatorMultilink.dispose();
      termsMultilink && termsMultilink.dispose();
    };

    this.mutate( options );
  }

  public override dispose(): void {
    this.disposeEquationNode();
    super.dispose();
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
            children.push( valueToOperatorNode( numberOfTermsOnPlate, providedOptions.operatorFont ) );
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
              children.push( valueToOperatorNode( coefficient.getValue(), providedOptions.operatorFont ) );
              coefficient = coefficient.abs();
            }

            // Must be disposed because it links to a translated StringProperty.
            const equationTermNode = VariableTermNode.createEquationTermNode( coefficient, termCreator.variable.symbolProperty, {
              integerFont: providedOptions.integerFont,
              fractionFont: providedOptions.fractionFont,
              symbolFont: providedOptions.symbolFont,
              coefficientSpacing: providedOptions.coefficientSpacing
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
              children.push( valueToOperatorNode( constantValue.getValue(), providedOptions.operatorFont ) );
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
function valueToOperatorNode( value: number, operatorFont: Font ): Node {
  const operator = ( value > 0 ) ? MathSymbols.PLUS : MathSymbols.MINUS;
  return new Text( operator, { font: operatorFont } );
}

equalityExplorer.register( 'EquationNode', EquationNode );