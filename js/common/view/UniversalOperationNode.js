// Copyright 2018-2022, University of Colorado Boulder

/**
 * Displays an operation.
 * Used in the animation that occurs when the universal operation 'go' button is pressed.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import { HBox, Text } from '../../../../scenery/js/imports.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerConstants from '../EqualityExplorerConstants.js';
import ConstantTerm from '../model/ConstantTerm.js';
import VariableTerm from '../model/VariableTerm.js';
import ConstantTermNode from './ConstantTermNode.js';
import VariableTermNode from './VariableTermNode.js';

export default class UniversalOperationNode extends HBox {
  /**
   * @param {UniversalOperation} operation
   * @param {Object} [options]
   */
  constructor( operation, options ) {

    options = merge( {

      // HBox options
      spacing: 4
    }, options );

    assert && assert( !options.children, 'UniversalOperationNode sets children' );
    options.children = [
      UniversalOperationNode.createOperatorNode( operation.operator ),
      UniversalOperationNode.createOperandNode( operation.operand )
    ];

    super( options );
  }

  /**
   * Creates the view for a universal operator.
   * @param {UniversalOperator} operator
   * @returns {scenery.Node}
   * @public
   * @static
   */
  static createOperatorNode( operator ) {
    return new Text( operator, {
      font: EqualityExplorerConstants.UNIVERSAL_OPERATION_INTEGER_FONT
    } );
  }

  /**
   * Creates the view for a universal operand.
   * @param {Term} operand
   * @returns {scenery.Node}
   * @public
   * @static
   */
  static createOperandNode( operand ) {

    let operandNode = null;

    if ( operand instanceof ConstantTerm ) {
      operandNode = ConstantTermNode.createEquationTermNode( operand.constantValue, {
        integerFont: EqualityExplorerConstants.UNIVERSAL_OPERATION_INTEGER_FONT,
        fractionFont: EqualityExplorerConstants.UNIVERSAL_OPERATION_FRACTION_FONT
      } );
    }
    else if ( operand instanceof VariableTerm ) {
      //TODO https://github.com/phetsims/equality-explorer/issues/187 operandNode must be disposed because it links to a translated string Property
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