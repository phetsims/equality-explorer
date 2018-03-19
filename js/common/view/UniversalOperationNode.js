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
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Text = require( 'SCENERY/nodes/Text' );
  var UniversalOperandNode = require( 'EQUALITY_EXPLORER/common/view/UniversalOperandNode' );

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

    var operandNode = new UniversalOperandNode( operation.operand, {
      symbolFont: options.symbolFont,
      integerFont: options.integerFont,
      fractionFont: options.fractionFont
    } );

    assert && assert( !options.children, 'UniversalOperationNode sets children' );
    options.children = [ operatorNode, operandNode ];

    HBox.call( this, options );
  }

  equalityExplorer.register( 'UniversalOperationNode', UniversalOperationNode );

  return inherit( HBox, UniversalOperationNode );
} );
 