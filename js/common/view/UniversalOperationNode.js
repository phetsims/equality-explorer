// Copyright 2018, University of Colorado Boulder

/**
 * Displays an operation.
 * Used in the animation that occurs when the universal operation 'go' button is pressed.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ConstantTermNode = require( 'EQUALITY_EXPLORER/common/view/ConstantTermNode' );
  var ConstantTermOperand = require( 'EQUALITY_EXPLORER/common/model/ConstantTermOperand' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VariableTermNode = require( 'EQUALITY_EXPLORER/common/view/VariableTermNode' );
  var VariableTermOperand = require( 'EQUALITY_EXPLORER/common/model/VariableTermOperand' );

  /**
   * @param {UniversalOperation} operation
   * @param {Object} [options]
   * @constructor
   */
  function UniversalOperationNode( operation, options ) {

    options = _.extend( {
      symbolFont: EqualityExplorerConstants.UNIVERSAL_OPERATION_SYMBOL_FONT,
      integerFont: EqualityExplorerConstants.UNIVERSAL_OPERATION_INTEGER_FONT,
      fractionFont: EqualityExplorerConstants.UNIVERSAL_OPERATION_FRACTION_FONT,

      // supertype options
      spacing: 4
    }, options );

    var operatorNode = UniversalOperationNode.createOperatorNode( operation.operator, {
      font: options.integerFont
    } );

    var operandNode = UniversalOperationNode.createOperandNode( operation.operand, {
      symbolFont: options.symbolFont,
      integerFont: options.integerFont,
      fractionFont: options.fractionFont
    } );

    assert && assert( !options.children, 'UniversalOperationNode sets children' );
    options.children = [ operatorNode, operandNode ];

    HBox.call( this, options );
  }

  equalityExplorer.register( 'UniversalOperationNode', UniversalOperationNode );

  return inherit( HBox, UniversalOperationNode, {}, {

    /**
     * Creates the view for a universal operator.
     * @param {string} operator
     * @param {Object} [options]
     * @returns {Node}
     * @public
     * @static
     */
    createOperatorNode: function( operator, options ) {
      return new Text( operator, options );
    },

    /**
     * Creates the view for a universal operand.
     * @param {ConstantTermOperand|VariableTermOperand} operand
     * @param {Object} [options]
     * @returns {Node}
     * @public
     * @static
     */
    createOperandNode: function( operand, options ) {

      var operandNode = null;

      if ( operand instanceof ConstantTermOperand ) {
        operandNode = ConstantTermNode.createEquationTermNode( operand.constantValue, {
          integerFont: options.integerFont,
          fractionFont: options.fractionFont
        } );
      }
      else if ( operand instanceof VariableTermOperand ) {
        operandNode = VariableTermNode.createEquationTermNode( operand.coefficient, operand.symbol, {
          symbolFont: options.symbolFont,
          integerFont: options.integerFont,
          fractionFont: options.fractionFont
        } );
      }
      else {
        throw new Error( 'unsupported operand type: ' + operand );
      }

      return operandNode;
    }
  } );
} );
 