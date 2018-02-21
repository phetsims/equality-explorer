// Copyright 2018, University of Colorado Boulder

/**
 * Term whose value a coefficient times some variable value.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Property = require( 'AXON/Property' );
  var ReducedFraction = require( 'EQUALITY_EXPLORER/common/model/ReducedFraction' );
  var Term = require( 'EQUALITY_EXPLORER/common/model/Term' );

  /**
   * @param {string} symbol
   * @param {NumberProperty} variableValueProperty
   * @param {Object} [options]
   * @constructor
   */
  function VariableTerm( symbol, variableValueProperty, options ) {

    assert && assert( variableValueProperty instanceof NumberProperty, 'invalid variableValueProperty' );

    options = _.extend( {
      coefficient: ReducedFraction.withInteger( 1 ) // {ReducedFraction} initial coefficient
    }, options );

    assert && assert( options.coefficient instanceof ReducedFraction, 'invalid coefficient' );

    // @public (read-only)
    this.symbol = symbol;

    // @public {Property.<ReducedFraction>}
    this.coefficientProperty = new Property( options.coefficient, { valueType: ReducedFraction } );

    // @public (read-only) {NumberProperty}
    this.variableValueProperty = variableValueProperty;

    // @public (read-only) {DerivedProperty.<ReducedFraction>}
    // dispose of this in dispose().
    this.weightProperty = new DerivedProperty( [ this.coefficientProperty, variableValueProperty ],

      /**
       * @param {ReducedFraction} coefficient
       * @param {number} variableValue
       * @returns {ReducedFraction}
       */
      function( coefficient, variableValue ) {
        return coefficient.timesInteger( variableValue );
      }, {
        valueType: ReducedFraction
      });

    Term.call( this, options );
  }

  equalityExplorer.register( 'VariableTerm', VariableTerm );

  return inherit( Term, VariableTerm, {

    /**
     * For debugging only.
     * @returns {string}
     * @public
     */
    toString: function() {
      return 'VariableTerm:' +
             ' coefficient=' + this.coefficientProperty.value.toString() +
             ' symbol=' + this.symbol +
             ' variableValue=' + this.variableValueProperty.value;
    },

    /**
     * @public
     * @override
     */
    dispose: function() {
      this.weightProperty.dispose(); // dispose of DerivedProperty first
      this.coefficientProperty.dispose();
      Term.prototype.dispose.call( this );
    },

    /**
     * @public
     * @override
     */
    reset: function() {
      this.coefficientProperty.reset();
      Term.prototype.reset.call( this );
    },

    /**
     * Is this term the inverse of a specified term?
     * Two variable terms are inverses if they represent the same variable and their weights sum to zero.
     * @param {Term} term
     * @returns {boolean}
     * @public
     * @override
     * @abstract
     */
    isInverseOf: function( term ) {
      return ( this.constructor === term.constructor ) &&
             ( this.symbol === term.symbol ) &&
             ( this.weightProperty.value.toDecimal() + term.weightProperty.value.toDecimal() === 0 );
    },

    /**
     * Multiplies the number of terms by an integer value.
     * @param {number} value
     * @public
     */
    timesInteger: function( value ) {
      this.coefficientProperty.value = this.coefficientProperty.value.timesInteger( value );
    },

    /**
     * Divides the number of terms by an integer value.
     * @param {number} value
     * @public
     */
    divideByInteger: function( value ) {
      this.coefficientProperty.value = this.coefficientProperty.value.divideByInteger( value );
    }
  } );
} );
 