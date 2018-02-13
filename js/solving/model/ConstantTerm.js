// Copyright 2018, University of Colorado Boulder

/**
 * Term whose value is a constant.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var ReducedFraction = require( 'EQUALITY_EXPLORER/common/model/ReducedFraction' );
  var Term = require( 'EQUALITY_EXPLORER/solving/model/Term' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function ConstantTerm( options ) {

    options = _.extend( {
      value: ReducedFraction.ZERO // {ReducedFraction} initial value
    }, options );

    // @public {Property.<ReducedFraction>}
    this.valueProperty = new Property( options.value );

    Term.call( this, options );
  }

  equalityExplorer.register( 'ConstantTerm', ConstantTerm );

  return inherit( Term, ConstantTerm, {

    // @public
    reset: function() {
      this.valueProperty.reset();
      Term.prototype.reset.call( this );
    },

    /**
     * Adds an integer value to the constant.
     * @param {number} value
     * @public
     */
    plus: function( value ) {
      this.valueProperty.value = this.valueProperty.value.plus( value );
    },

    /**
     * Subtracts an integer value from the constant.
     * @param {number} value
     * @public
     */
    minus: function( value ) {
      this.valueProperty.value = this.valueProperty.value.minus( value );
    },

    /**
     * Multiplies the number of items by an integer value.
     * @param {number} value
     * @public
     */
    times: function( value ) {
      this.valueProperty.value = this.valueProperty.value.times( value );
    },

    /**
     * Divides the number of items by an integer value.
     * @param {number} value
     * @public
     */
    divide: function( value ) {
      this.valueProperty.value = this.valueProperty.value.divide( value );
    }
  } );
} );
 