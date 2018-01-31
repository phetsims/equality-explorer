// Copyright 2018, University of Colorado Boulder

/**
 * The constant term that appears on the scale in the Solving screen.
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
   * @param {AbstractItemCreator} positiveItemCreator
   * @param {AbstractItemCreator} negativeItemCreator
   * @constructor
   */
  function ConstantTerm( positiveItemCreator, negativeItemCreator ) {

    Term.call( this, positiveItemCreator, negativeItemCreator );

    // @public {Property.<ReducedFraction>} the constant value
    this.constantProperty = new Property( ReducedFraction.ZERO );
  }

  equalityExplorer.register( 'ConstantTerm', ConstantTerm );

  return inherit( Term, ConstantTerm, {

    /**
     * Gets the value of this term.
     * @returns {number}
     * @public
     * @override
     */
    getValue: function() {
      return this.constantProperty.value;
    },

    /**
     * @public
     */
    reset: function() {
      this.constantProperty.reset();
    },

    /**
     * Adds an integer value to the constant.
     * @param {number} value
     * @public
     * @override
     */
    plus: function( value ) {
      this.constantProperty.value = this.constantProperty.value.plus( value );
    },

    /**
     * Subtracts an integer value from the constant.
     * @param {number} value
     * @public
     * @override
     */
    minus: function( value ) {
      this.constantProperty.value = this.constantProperty.value.minus( value );
    },

    /**
     * Multiplies the constant by an integer value.
     * @param {number} value
     * @public
     * @override
     */
    times: function( value ) {
      this.constantProperty.value = this.constantProperty.value.times( value );
    },

    /**
     * Divides the constant by an integer value.
     * @param {number} value
     * @public
     * @override
     */
    divide: function( value ) {
      this.constantProperty.value = this.constantProperty.value.divide( value );
    }
  } );
} );
 