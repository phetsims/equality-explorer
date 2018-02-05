// Copyright 2018, University of Colorado Boulder

/**
 * A reduced fraction.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var Fraction = require( 'PHETCOMMON/model/Fraction' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Util = require( 'DOT/Util' );

  /**
   * @param {number} numerator - integer
   * @param {number} denominator - integer
   * @constructor
   */
  function ReducedFraction( numerator, denominator ) {
    Fraction.call( this, numerator, denominator );
    this.reduce();
  }

  equalityExplorer.register( 'ReducedFraction', ReducedFraction );

  inherit( Fraction, ReducedFraction, {

    /**
     * Adds an integer value to this fraction and returns a new fraction.
     * @param {number} value
     * @returns {ReducedFraction}
     * @public
     */
    plus: function( value ) {
      assert && assert( Util.isInteger( value ), 'value is not an integer: ' + value );
      return new ReducedFraction( this.numerator + ( value * this.denominator ), this.denominator );
    },

    /**
     * Subtracts an integer value from this fraction and returns a new fraction.
     * @param {number} value
     * @returns {ReducedFraction}
     * @public
     */
    minus: function( value ) {
      assert && assert( Util.isInteger( value ), 'value is not an integer: ' + value );
      return new ReducedFraction( this.numerator - ( value * this.denominator ), this.denominator );
    },

    /**
     * Multiplies this fraction by an integer value and returns a new fraction.
     * @param {number} value
     * @returns {ReducedFraction}
     * @public
     */
    times: function( value ) {
      assert && assert( Util.isInteger( value ), 'value is not an integer: ' + value );
      return new ReducedFraction( this.numerator * value, this.denominator );
    },

    /**
     * Divides this fraction by an integer value and returns a new fraction.
     * @param {number} value
     * @returns {ReducedFraction}
     * @public
     */
    divide: function( value ) {
      assert && assert( Util.isInteger( value ), 'value is not an integer: ' + value );
      assert && assert( value !== 0, 'division by zero' );
      return new ReducedFraction( this.numerator, this.denominator * value );
    }
  } );

  // Common values
  ReducedFraction.ZERO = new ReducedFraction( 0, 1 );
  ReducedFraction.ONE = new ReducedFraction( 1, 1 );

  return ReducedFraction;
} );