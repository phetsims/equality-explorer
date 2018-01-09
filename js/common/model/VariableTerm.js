// Copyright 2018, University of Colorado Boulder

/**
 * The variable ('x') term that appears on the scale in the Solving screen.
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

  /**
   * @param {string} symbol
   * @param {Property.<number>} variableValueProperty
   * @param {AbstractItemCreator} positiveItemCreator
   * @param {AbstractItemCreator} negativeItemCreator
   * @constructor
   */
  function VariableTerm( symbol, variableValueProperty, positiveItemCreator, negativeItemCreator ) {

    // @public (read-only)
    this.symbol = symbol;
    this.positiveItemCreator = positiveItemCreator;
    this.negativeItemCreator = negativeItemCreator;

    // @public {Property.<ReducedFraction>} coefficient that appears in front of the symbol for this item in equations
    this.coefficientProperty = new Property( ReducedFraction.ZERO );

    // @public {DerivedProperty.<number>} total weight of this item
    this.weightProperty = new DerivedProperty( [ this.coefficientProperty, variableValueProperty ],
      function( coefficient, variableValue ) {
        return coefficient * variableValue;
      } );
  }

  equalityExplorer.register( 'VariableTerm', VariableTerm );

  return inherit( Object, VariableTerm, {

    /**
     * Multiplies the coefficient by an integer value.
     * @param {number} value
     * @public
     */
    times: function( value ) {
      this.coefficientProperty.value = this.coefficientProperty.value.times( value );
    },

    /**
     * Divides the coefficient by an integer value.
     * @param {number} value
     * @public
     */
    divide: function( value ) {
      this.coefficientProperty.value = this.coefficientProperty.value.divide( value );
    }
  } );
} );
 