// Copyright 2018, University of Colorado Boulder

/**
 * Displays a universal operand.
 * Used in the operand picker, and in the animaton that occurs when the universal operation 'go' button is pressed.
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
   * @param {ConstantTermOperand|VariableTermOperand} operand
   * @param {Object} [options]
   * @constructor
   */
  function UniversalOperandNode( operand, options ) {

    options = _.extend( {
      symbolFont: EqualityExplorerConstants.UNIVERSAL_OPERATION_SYMBOL_FONT,
      integerFont: EqualityExplorerConstants.UNIVERSAL_OPERATION_INTEGER_FONT,
      fractionFont: EqualityExplorerConstants.UNIVERSAL_OPERATION_FRACTION_FONT,

      // supertype options
      spacing: 2
    }, options );

    assert && assert( !options.children, 'UniversalOperandNode sets children' );
    options.children = [];

    if ( operand instanceof ConstantTermOperand ) {

      // N
      options.children.push( new ReducedFractionNode( operand.constantValue, {
        integerFont: options.integerFont,
        fractionFont: options.fractionFont
      } ) );
    }
    else if ( operand instanceof VariableTermOperand ) {

      if ( operand.coefficient.getValue() === 1 ) {
        // x
        options.children.push( new Text( operand.symbol, { font: options.symbolFont } ) );
      }
      else if ( operand.coefficient.getValue() === -1 ) {
        // -x
        options.children.push( new Text( MathSymbols.UNARY_MINUS + operand.symbol, { font: options.symbolFont } ) );
      }
      else {
        // Nx
        options.children.push( new ReducedFractionNode( operand.coefficient, {
          integerFont: options.integerFont,
          fractionFont: options.fractionFont
        } ) );
        options.children.push( new Text( operand.symbol, { font: options.symbolFont } ) );
      }
    }
    else {
      throw new Error( 'unsupported operand type: ' + operand );
    }

    HBox.call( this, options );
  }

  equalityExplorer.register( 'UniversalOperandNode', UniversalOperandNode );

  return inherit( HBox, UniversalOperandNode );
} );
 