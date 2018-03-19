// Copyright 2018, University of Colorado Boulder

/**
 * Data structure for a variable term operand in a universal operation.
 * There's not much to this data structure. It's a type solely for differentiation with ConstantTermOperand.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {number} coefficient
   * @param {string} symbol
   * @constructor
   */
  function VariableTermOperand( coefficient, symbol ) {

    // @public (read-only)
    this.coefficient = coefficient;
    this.symbol = symbol;
  }

  equalityExplorer.register( 'VariableTermOperand', VariableTermOperand );

  return inherit( Object, VariableTermOperand );
} );