// Copyright 2018, University of Colorado Boulder

//TODO merge this into VariableTerm
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
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var ReducedFraction = require( 'EQUALITY_EXPLORER/common/model/ReducedFraction' );
  var Term2 = require( 'EQUALITY_EXPLORER/common/model/Term2' );

  /**
   * @param {string|Node} symbol
   * @param {Property.<number>} variableValueProperty
   * @param {Object} [options]
   * @constructor
   */
  function VariableTerm2( symbol, variableValueProperty, options ) {

    assert && assert( typeof symbol === 'string' || symbol instanceof Node, 'invalid symbol type' );

    options = _.extend( {
      coefficient: ReducedFraction.withInteger( 1 ) // {ReducedFraction} initial coefficient
    }, options );

    // @public (read-only)
    this.symbol = symbol;

    // @public {Property.<ReducedFraction>}
    this.coefficientProperty = new Property( options.coefficient );

    // @public (read-only) {DerivedProperty.<ReducedFraction>}
    this.weightProperty = new DerivedProperty( [ this.coefficientProperty, variableValueProperty ],
      function( coefficient, variableValue ) {
        return coefficient.timesInteger( variableValue );
      } );

    Term2.call( this, options );
  }

  equalityExplorer.register( 'VariableTerm2', VariableTerm2 );

  return inherit( Term2, VariableTerm2, {

    // @public
    reset: function() {
      this.coefficientProperty.reset();
      Term2.prototype.reset.call( this );
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
 