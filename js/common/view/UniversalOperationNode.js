// Copyright 2018-2019, University of Colorado Boulder

/**
 * Displays an operation.
 * Used in the animation that occurs when the universal operation 'go' button is pressed.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerConstants from '../EqualityExplorerConstants.js';
import ConstantTerm from '../model/ConstantTerm.js';
import VariableTerm from '../model/VariableTerm.js';
import ConstantTermNode from './ConstantTermNode.js';
import VariableTermNode from './VariableTermNode.js';

/**
 * @param {UniversalOperation} operation
 * @param {Object} [options]
 * @constructor
 */
function UniversalOperationNode( operation, options ) {

  options = merge( {

    // HBox options
    spacing: 4
  }, options );

  assert && assert( !options.children, 'UniversalOperationNode sets children' );
  options.children = [
    UniversalOperationNode.createOperatorNode( operation.operator ),
    UniversalOperationNode.createOperandNode( operation.operand )
  ];

  HBox.call( this, options );
}

equalityExplorer.register( 'UniversalOperationNode', UniversalOperationNode );

export default inherit( HBox, UniversalOperationNode, {}, {

  /**
   * Creates the view for a universal operator.
   * @param {string} operator - see EqualityExplorerConstants.OPERATORS
   * @returns {Node}
   * @public
   * @static
   */
  createOperatorNode: function( operator ) {
    return new Text( operator, {
      font: EqualityExplorerConstants.UNIVERSAL_OPERATION_INTEGER_FONT
    } );
  },

  /**
   * Creates the view for a universal operand.
   * @param {Term} operand
   * @returns {Node}
   * @public
   * @static
   */
  createOperandNode: function( operand ) {

    let operandNode = null;

    if ( operand instanceof ConstantTerm ) {
      operandNode = ConstantTermNode.createEquationTermNode( operand.constantValue, {
        integerFont: EqualityExplorerConstants.UNIVERSAL_OPERATION_INTEGER_FONT,
        fractionFont: EqualityExplorerConstants.UNIVERSAL_OPERATION_FRACTION_FONT
      } );
    }
    else if ( operand instanceof VariableTerm ) {
      operandNode = VariableTermNode.createEquationTermNode( operand.coefficient, operand.variable.symbol, {
        symbolFont: EqualityExplorerConstants.UNIVERSAL_OPERATION_SYMBOL_FONT,
        integerFont: EqualityExplorerConstants.UNIVERSAL_OPERATION_INTEGER_FONT,
        fractionFont: EqualityExplorerConstants.UNIVERSAL_OPERATION_FRACTION_FONT,
        maxWidth: 50 // determined empirically
      } );
    }
    else {
      throw new Error( 'unsupported operand type: ' + operand );
    }

    return operandNode;
  }
} );