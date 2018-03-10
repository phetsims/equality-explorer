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

  return inherit( Fraction, ReducedFraction, {

    /**
     * Gets the value in decimal format. This function is provided to improved readability and searchability.
     * @returns {number}
     * @public
     */
    toDecimal: function() {
       return this.getValue();
    },

    /**
     * Returns the absolute value of this fraction.
     * @returns {ReducedFraction}
     * @public
     */
    abs: function() {
      return new ReducedFraction( Math.abs( this.numerator ), Math.abs( this.denominator ) );
    },

    /**
     * Adds a fraction to this fraction.
     * @param {Fraction} value
     * @returns {ReducedFraction}
     * @public
     */
    plusFraction: function( value ) {
      assert && assert( value instanceof Fraction, 'value is not a Fraction' );
      var numerator = ( this.numerator * value.denominator ) + ( value.numerator * this.denominator );
      var denominator = this.denominator * value.denominator;
      return new ReducedFraction( numerator, denominator );
    },

    /**
     * Subtracts a fraction from this fraction.
     * @param {Fraction} value
     * @returns {ReducedFraction}
     * @public
     */
    minusFraction: function( value ) {
      assert && assert( value instanceof Fraction, 'value is not a Fraction' );
      return this.plusFraction( value.timesInteger( -1 ) );
    },

    /**
     * Adds an integer value to this fraction and returns a new fraction.
     * @param {number} value
     * @returns {ReducedFraction}
     * @public
     */
    plusInteger: function( value ) {
      assert && assert( Util.isInteger( value ), 'value is not an integer: ' + value );
      return new ReducedFraction( this.numerator + ( value * this.denominator ), this.denominator );
    },

    /**
     * Subtracts an integer value from this fraction and returns a new fraction.
     * @param {number} value
     * @returns {ReducedFraction}
     * @public
     */
    minusInteger: function( value ) {
      assert && assert( Util.isInteger( value ), 'value is not an integer: ' + value );
      return new ReducedFraction( this.numerator - ( value * this.denominator ), this.denominator );
    },

    /**
     * Multiplies this fraction by an integer value and returns a new fraction.
     * @param {number} value
     * @returns {ReducedFraction}
     * @public
     */
    timesInteger: function( value ) {
      assert && assert( Util.isInteger( value ), 'value is not an integer: ' + value );
      return new ReducedFraction( this.numerator * value, this.denominator );
    },

    /**
     * Divides this fraction by an integer value and returns a new fraction.
     * @param {number} value
     * @returns {ReducedFraction}
     * @public
     */
    divideByInteger: function( value ) {
      assert && assert( Util.isInteger( value ), 'value is not an integer: ' + value );
      assert && assert( value !== 0, 'division by zero' );
      return new ReducedFraction( this.numerator, this.denominator * value );
    }
  }, {

    /**
     * Creates a reduced fraction using an integer value.
     * @param value
     * @returns {ReducedFraction}
     * @public
     * @static
     */
    withInteger: function( value ) {
      assert && assert( Util.isInteger( value ), 'value is not an integer: ' + value );
      return new ReducedFraction( value, 1 );
    }
  } );
} );