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
  var Term = require( 'EQUALITY_EXPLORER/solving/model/Term' );

  /**
   * @param {AbstractItemCreator} positiveItemCreator
   * @param {AbstractItemCreator} negativeItemCreator
   * @param {Object} [options]
   * @constructor
   */
  function ConstantTerm( positiveItemCreator, negativeItemCreator, options ) {

    /**
     * Creates a DerivedProperty whose value is the weight of this term.
     * @param {Property.<ReducedFraction>} numberOfItemsProperty
     * @returns {DerivedProperty.<ReducedFraction>}
     */
    var createWeightProperty = function( numberOfItemsProperty ) {
      return new DerivedProperty( [ numberOfItemsProperty ],
        function( numberOfItems ) {
          return numberOfItems;
        } );
    };

    Term.call( this, positiveItemCreator, negativeItemCreator, createWeightProperty, options );
  }

  equalityExplorer.register( 'ConstantTerm', ConstantTerm );

  return inherit( Term, ConstantTerm, {

    /**
     * Adds an integer value to the constant.
     * @param {number} value
     * @public
     */
    plus: function( value ) {
      this.numberOfItemsProperty.value = this.numberOfItemsProperty.value.plus( value );
    },

    /**
     * Subtracts an integer value from the constant.
     * @param {number} value
     * @public
     */
    minus: function( value ) {
      this.numberOfItemsProperty.value = this.numberOfItemsProperty.value.minus( value );
    }
  } );
} );
 