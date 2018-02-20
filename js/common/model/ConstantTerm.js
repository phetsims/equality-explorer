// Copyright 2018, University of Colorado Boulder

/**
 * Term whose value is a constant.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var ReducedFraction = require( 'EQUALITY_EXPLORER/common/model/ReducedFraction' );
  var Term = require( 'EQUALITY_EXPLORER/common/model/Term' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function ConstantTerm( options ) {

    options = _.extend( {
      value: ReducedFraction.withInteger( 1 ) // {ReducedFraction} initial value
    }, options );

    assert && assert( options.value instanceof ReducedFraction, 'invalid value' );

    // @public {Property.<ReducedFraction>}
    this.valueProperty = new Property( options.value, {
      isValidValue: function( value ) {
        return value instanceof ReducedFraction;
      }
    } );

    // @public {DerivedProperty.<ReducedFraction>} weight is equivalent to the constant's value
    this.weightProperty = new DerivedProperty( [ this.valueProperty ],

      /**
       * @param {ReducedFraction} value
       * @returns {ReducedFraction}
       */
      function( value ) {
        return value;
      } );

    Term.call( this, options );
  }

  equalityExplorer.register( 'ConstantTerm', ConstantTerm );

  return inherit( Term, ConstantTerm, {

    /**
     * @public
     * @override
     */
    dispose: function() {
      this.weightProperty.dispose(); // dispose of DerivedProperty first
      this.valueProperty.dispose();
      Term.prototype.dispose.call( this );
    },

    /**
     * @public
     * @override
     */
    reset: function() {
      this.valueProperty.reset();
      Term.prototype.reset.call( this );
    },

    /**
     * Is this term the inverse of a specified term?
     * Two constant terms are inverses if their values weights to zero.
     * @param {Term} term
     * @returns {boolean}
     * @public
     * @override
     * @abstract
     */
    isInverseOf: function( term ) {
      return ( this.constructor === term.constructor ) &&
             ( this.weightProperty.value.toDecimal() + term.weightProperty.value.toDecimal() === 0 );
    },

    /**
     * Adds an integer value to the constant.
     * @param {number} value
     * @public
     */
    plusInteger: function( value ) {
      this.valueProperty.value = this.valueProperty.value.plusInteger( value );
    },

    /**
     * Subtracts an integer value from the constant.
     * @param {number} value
     * @public
     */
    minusInteger: function( value ) {
      this.valueProperty.value = this.valueProperty.value.minusInteger( value );
    },

    /**
     * Multiplies the number of terms by an integer value.
     * @param {number} value
     * @public
     */
    timesInteger: function( value ) {
      this.valueProperty.value = this.valueProperty.value.timesInteger( value );
    },

    /**
     * Divides the number of terms by an integer value.
     * @param {number} value
     * @public
     */
    divideByInteger: function( value ) {
      this.valueProperty.value = this.valueProperty.value.divideByInteger( value );
    }
  } );
} );
 