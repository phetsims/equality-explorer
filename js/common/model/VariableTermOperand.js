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
  var Fraction = require( 'PHETCOMMON/model/Fraction' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {number} coefficient
   * @param {string} symbol
   * @constructor
   */
  function VariableTermOperand( coefficient, symbol ) {

    assert && assert( coefficient instanceof Fraction, 'invalid coefficient: ' + coefficient );
    assert && assert( coefficient.isReduced(), 'coefficient must be reduced: ' + coefficient );

    // @public (read-only)
    this.coefficient = coefficient;
    this.symbol = symbol;
  }

  equalityExplorer.register( 'VariableTermOperand', VariableTermOperand );

  return inherit( Object, VariableTermOperand, {

    /**
     * For debugging only. Do not rely on the format of this.
     * @public
     * @returns {string}
     */
    toString: function() {
      return 'VariableTermOperand: ' + this.coefficient + ' ' + this.symbol;
    }
  } );
} );