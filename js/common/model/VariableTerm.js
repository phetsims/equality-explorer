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
  var Property = require( 'AXON/Property' );
  var ReducedFraction = require( 'EQUALITY_EXPLORER/common/model/ReducedFraction' );
  var Term = require( 'EQUALITY_EXPLORER/common/model/Term' );

  /**
   * @param {string} symbol
   * @param {Property.<number>} variableValueProperty
   * @param {Object} [options]
   * @constructor
   */
  function VariableTerm( symbol, variableValueProperty, options ) {

    options = _.extend( {
      coefficient: ReducedFraction.ZERO // {ReducedFraction} initial coefficient
    }, options );

    // @public (read-only)
    this.symbol = symbol;

    // @public {Property.<ReducedFraction>}
    this.coefficientProperty = new Property( options.numberOfItems );

    // @public (read-only) {DerivedProperty.<ReducedFraction>}
    this.weightProperty = new DerivedProperty( [ this.coefficientProperty, variableValueProperty ],
      function( coefficient, variableValue ) {
        return coefficient.times( variableValue );
      } );

    Term.call( this, options );
  }

  equalityExplorer.register( 'VariableTerm', VariableTerm );

  return inherit( Term, VariableTerm, {

    // @public
    reset: function() {
      this.coefficientProperty.reset();
      Term.prototype.reset.call( this );
    },

    /**
     * Multiplies the number of items by an integer value.
     * @param {number} value
     * @public
     */
    times: function( value ) {
      this.coefficientProperty.value = this.coefficientProperty.value.times( value );
    },

    /**
     * Divides the number of items by an integer value.
     * @param {number} value
     * @public
     */
    divide: function( value ) {
      this.coefficientProperty.value = this.coefficientProperty.value.divide( value );
    },
  } );
} );
 