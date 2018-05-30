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
  var ConstantTerm = require( 'EQUALITY_EXPLORER/common/model/ConstantTerm' );
  var ConstantTermNode = require( 'EQUALITY_EXPLORER/common/view/ConstantTermNode' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VariableTerm = require( 'EQUALITY_EXPLORER/common/model/VariableTerm' );
  var VariableTermNode = require( 'EQUALITY_EXPLORER/common/view/VariableTermNode' );

  /**
   * @param {UniversalOperation} operation
   * @param {Object} [options]
   * @constructor
   */
  function UniversalOperationNode( operation, options ) {

    options = _.extend( {

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

  return inherit( HBox, UniversalOperationNode, {}, {

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

      var operandNode = null;

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
} );
 