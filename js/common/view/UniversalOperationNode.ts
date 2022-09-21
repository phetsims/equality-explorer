// Copyright 2018-2022, University of Colorado Boulder

/**
 * Displays an operation.
 * Used in the animation that occurs when the universal operation 'go' button is pressed.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import { HBox, HBoxOptions, Node, NodeTranslationOptions, Text } from '../../../../scenery/js/imports.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerConstants from '../EqualityExplorerConstants.js';
import ConstantTerm from '../model/ConstantTerm.js';
import UniversalOperation, { UniversalOperand, UniversalOperator } from '../model/UniversalOperation.js';
import VariableTerm from '../model/VariableTerm.js';
import ConstantTermNode from './ConstantTermNode.js';
import VariableTermNode from './VariableTermNode.js';

type SelfOptions = EmptySelfOptions;

type UniversalOperationNodeOptions = SelfOptions & NodeTranslationOptions & PickOptional<HBoxOptions, 'maxHeight'>;

export default class UniversalOperationNode extends HBox {

  private readonly disposeUniversalOperationNode: () => void;

  public constructor( operation: UniversalOperation, providedOptions?: UniversalOperationNodeOptions ) {

    const options = optionize<UniversalOperationNodeOptions, SelfOptions, HBoxOptions>()( {

      // HBoxOptions
      spacing: 4
    }, providedOptions );

    const operatorNode = UniversalOperationNode.createOperatorNode( operation.operator );

    // If operandNode involves a variable, it is linked to a translated StringProperty and must be disposed.
    const operandNode = UniversalOperationNode.createOperandNode( operation.operand );

    assert && assert( !options.children, 'UniversalOperationNode sets children' );
    options.children = [ operatorNode, operandNode ];

    super( options );

    this.disposeUniversalOperationNode = () => {
      operandNode.dispose();
    };
  }

  public override dispose(): void {
    this.disposeUniversalOperationNode();
    super.dispose();
  }

  /**
   * Creates the view for a universal operator.
   */
  public static createOperatorNode( operator: UniversalOperator ): Node {
    return new Text( operator, {
      font: EqualityExplorerConstants.UNIVERSAL_OPERATION_INTEGER_FONT
    } );
  }

  /**
   * Creates the view for a universal operand.
   */
  public static createOperandNode( operand: UniversalOperand ): Node {

    let operandNode = null;

    if ( operand instanceof ConstantTerm ) {
      operandNode = ConstantTermNode.createEquationTermNode( operand.constantValue, {
        integerFont: EqualityExplorerConstants.UNIVERSAL_OPERATION_INTEGER_FONT,
        fractionFont: EqualityExplorerConstants.UNIVERSAL_OPERATION_FRACTION_FONT
      } );
    }
    else if ( operand instanceof VariableTerm ) {
      operandNode = VariableTermNode.createEquationTermNode( operand.coefficient, operand.variable.symbolProperty, {
        symbolFont: EqualityExplorerConstants.UNIVERSAL_OPERATION_SYMBOL_FONT,
        integerFont: EqualityExplorerConstants.UNIVERSAL_OPERATION_INTEGER_FONT,
        fractionFont: EqualityExplorerConstants.UNIVERSAL_OPERATION_FRACTION_FONT,
        maxWidth: 50 // determined empirically
      } );
    }
    else {
      throw new Error( `unsupported operand type: ${operand}` );
    }

    return operandNode;
  }
}

equalityExplorer.register( 'UniversalOperationNode', UniversalOperationNode );