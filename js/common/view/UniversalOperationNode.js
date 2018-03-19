// Copyright 2018, University of Colorado Boulder

/**
 * Displays a universal operation, as created by the universal operation control.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ConstantTermOperand = require( 'EQUALITY_EXPLORER/common/model/ConstantTermOperand' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var ReducedFractionNode = require( 'EQUALITY_EXPLORER/common/view/ReducedFractionNode' );
  var Text = require( 'SCENERY/nodes/Text' );
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

    var operatorNode = new Text( operation.operator, { font: options.integerFont } );

    var operandNode = null;
    if ( operation.operand instanceof ConstantTermOperand ) {
      operandNode = new ReducedFractionNode( operation.operand.constantValue, {
        integerFont: options.integerFont,
        fractionFont: options.fractionFont
      } );
    }
    else if ( operation.operand instanceof VariableTermOperand ){

      var coefficient = operation.operand.coefficient;
      var symbol = operation.operand.symbol;

      if ( coefficient === 1 ) {
        // x
        operandNode = new Text( symbol, { font: options.symbolFont } );
      }
      else if ( coefficient === -1 ) {
        // -x
        operandNode = new Text( MathSymbols.UNARY_MINUS + symbol, { font: options.symbolFont } );
      }
      else {
        // Nx
        operandNode = new HBox( {
          spacing: 2,
          children: [
            new ReducedFractionNode( coefficient, {
              integerFont: options.integerFont,
              fractionFont: options.fractionFont
            } ),
            new Text( symbol, { font: options.symbolFont } )
          ]
        } );
      }
    }
    else {
      throw new Error( 'unsupported operand type: ' + operation.operand );
    }

    assert && assert( !options.children, 'UniversalOperationNode sets children' );
    options.children = [ operatorNode, operandNode ];

    HBox.call( this, options );
  }

  equalityExplorer.register( 'UniversalOperationNode', UniversalOperationNode );

  return inherit( HBox, UniversalOperationNode );
} );
 