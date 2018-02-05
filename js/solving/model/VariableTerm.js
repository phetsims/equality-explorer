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
  var Term = require( 'EQUALITY_EXPLORER/solving/model/Term' );

  /**
   * @param {string} symbol
   * @param {Property.<number>} variableValueProperty
   * @param {AbstractItemCreator} positiveItemCreator
   * @param {AbstractItemCreator} negativeItemCreator
   * @param {Object} [options]
   * @constructor
   */
  function VariableTerm( symbol, variableValueProperty, positiveItemCreator, negativeItemCreator, options ) {

    /**
     * Creates a DerivedProperty whose value is the weight of this term.
     * @param {Property.<ReducedFraction>} numberOfItemsProperty
     * @returns {DerivedProperty.<ReducedFraction>}
     */
    var createWeightProperty = function( numberOfItemsProperty ) {
      return new DerivedProperty( [ numberOfItemsProperty, variableValueProperty ],
        function( numberOfItems, variableValue ) {
          return numberOfItems.times( variableValue );
        } );
    };

    Term.call( this, positiveItemCreator, negativeItemCreator, createWeightProperty, options );

    // @public (read-only)
    this.symbol = symbol;
  }

  equalityExplorer.register( 'VariableTerm', VariableTerm );

  return inherit( Term, VariableTerm );
} );
 