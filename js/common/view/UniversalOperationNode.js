// Copyright 2018, University of Colorado Boulder

/**
 * Displays a universal operation, as created by the universal operation control.
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
  var MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  /**
   * @param {UniversalOperation} operation
   * @param {Object} [options]
   * @constructor
   */
  function UniversalOperationNode( operation, options ) {

    options = _.extend( {
      fontSize: EqualityExplorerConstants.UNIVERSAL_OPERATION_FONT_SIZE,

      // supertype options
      spacing: 4
    }, options );

    var normalFont = new PhetFont( options.fontSize );
    var mathFont = new MathSymbolFont( options.fontSize );

    var operatorNode = new Text( operation.operator, { font: normalFont } );

    var operandNode = null;
    var constantValue = operation.operand.constantValue;
    if ( constantValue !== undefined ) {
      assert && assert( Util.isInteger( constantValue ), 'constantValue must be an integer: ' + constantValue );
      operandNode = new Text( constantValue, { font: normalFont } );
    }
    else {

      var coefficient = operation.operand.coefficient;
      var symbol = operation.operand.symbol;
      assert && assert( coefficient !== undefined, 'operand is missing coefficient: ' + operation.operand );
      assert && assert( Util.isInteger( coefficient ), 'coefficient must be an integer: ' + coefficient );
      assert && assert( operation.operand.symbol, 'operand is missing symbol: ' + operation.operand );

      if ( coefficient === 1 ) {
        // x
        operandNode = new Text( symbol, { font: mathFont } );
      }
      else if ( coefficient === -1 ) {
        // -x
        operandNode = new Text( MathSymbols.UNARY_MINUS + symbol, { font: mathFont } );
      }
      else {
        // Nx
        operandNode = new HBox( {
          spacing: 2,
          children: [
            new Text( coefficient, { font: normalFont } ),
            new Text( symbol, { font: mathFont } )
          ]
        } );
      }
    }

    assert && assert( !options.children, 'UniversalOperationNode sets children' );
    options.children = [ operatorNode, operandNode ];

    HBox.call( this, options );
  }

  equalityExplorer.register( 'UniversalOperationNode', UniversalOperationNode );

  return inherit( HBox, UniversalOperationNode );
} );
 