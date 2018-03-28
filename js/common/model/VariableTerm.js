// Copyright 2018, University of Colorado Boulder

/**
 * Term whose value is a coefficient times some variable value.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var Fraction = require( 'PHETCOMMON/model/Fraction' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Term = require( 'EQUALITY_EXPLORER/common/model/Term' );

  /**
   * @param {string} symbol - the variable's symbol, e.g. 'x'
   * @param {NumberProperty} variableValueProperty
   * @param {TermCreator} termCreator - created and manages this term
   * @param {Object} [options]
   * @constructor
   */
  function VariableTerm( symbol, variableValueProperty, termCreator, options ) {

    assert && assert( variableValueProperty instanceof NumberProperty,
      'invalid variableValueProperty: ' + variableValueProperty );

    options = _.extend( {
      coefficient: Fraction.fromInteger( 1 )
    }, options );

    assert && assert( options.coefficient instanceof Fraction, 'invalid coefficient: ' + options.coefficient );
    assert && assert( options.coefficient.isReduced(), 'coefficient must be reduced: ' + options.coefficient );
    assert && assert( options.coefficient.getValue() !== 0, 'coefficient cannot be zero' );

    // @public (read-only)
    this.symbol = symbol;

    // @public {Fraction}
    this.coefficient = options.coefficient;

    // @public (read-only) {NumberProperty}
    this.variableValueProperty = variableValueProperty;

    Term.call( this, termCreator, options );
  }

  equalityExplorer.register( 'VariableTerm', VariableTerm );

  return inherit( Term, VariableTerm, {

    /**
     * Gets the weight of this term.
     * @returns {Fraction}
     * @public
     * @override
     */
    get weight() {
      return this.coefficient.timesInteger( this.variableValueProperty.value ).reduced();
    },

    /**
     * For debugging only. Do not rely on the format of toString.
     * @returns {string}
     * @public
     */
    toString: function() {

      // e.g. 'VariableTerm: 1/3 x (x=3)'
      return 'VariableTerm: ' +  this.coefficient + ' ' + this.symbol +
             ' (' + this.symbol + '=' + this.variableValueProperty.value + ')';
    },

    /**
     * Is this term a like term?
     * @param {Term} term
     * @returns {boolean}
     * @public
     * @override
     */
    isLikeTerm: function( term ) {
      return ( term instanceof VariableTerm ) &&
             ( term.variableValueProperty === this.variableValueProperty ); // associated with same variable
    },

    /**
     * Is this term the inverse of a specified term?
     * Two variable terms are inverses if they represent the same variable and have inverse coefficients.
     * @param {Term} term
     * @returns {boolean}
     * @public
     * @override
     */
    isInverseTerm: function( term ) {
      return ( term instanceof VariableTerm ) &&
             ( this.variableProperty === term.variableProperty ) &&  // associated with same variable
             ( this.coefficient.getValue() === -term.coefficient.getValue() ); // inverse coefficients
    }
  } );
} );
 