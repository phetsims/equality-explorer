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
  var Term = require( 'EQUALITY_EXPLORER/common/model/Term' );
  var Util = require( 'DOT/Util' );

  // constants
  var DEFAULT_COEFFICIENT = Fraction.fromInteger( 1 );

  /**
   * @param {Variable} variable - the variable for this term, e.g. 'x'
   * @param {Object} [options]
   * @constructor
   */
  function VariableTerm( variable, options ) {

    options = _.extend( {
      coefficient: DEFAULT_COEFFICIENT
    }, options );

    assert && assert( options.coefficient instanceof Fraction, 'invalid coefficient: ' + options.coefficient );
    assert && assert( options.coefficient.isReduced(), 'coefficient must be reduced: ' + options.coefficient );
    assert && assert( options.coefficient.getValue() !== 0, 'coefficient cannot be zero' );

    // @public {Fraction}
    this.coefficient = options.coefficient;

    // @public (read-only)
    this.variable = variable;

    Term.call( this, options );
  }

  equalityExplorer.register( 'VariableTerm', VariableTerm );

  return inherit( Term, VariableTerm, {

    /**
     * For debugging only. Do not rely on the format of toString.
     * @returns {string}
     * @public
     */
    toString: function() {
      return 'VariableTerm: ' +  this.coefficient + ' ' + this.variable;
    },

    //-------------------------------------------------------------------------------------------------
    // Below here is the implementation of the Term API
    //-------------------------------------------------------------------------------------------------

    /**
     * Gets the weight of this term.
     * @returns {Fraction}
     * @public
     * @override
     */
    get weight() {
      return this.coefficient.timesInteger( this.variable.valueProperty.value ).reduced();
    },

    /**
     * Gets the sign of a term's significant number, indicating whether the number is positive, negative or zero.
     * The 'significant number' for a VariableTerm is its coefficient.
     * @returns {number} ala Math.sign
     * @public
     * @override
     */
    get sign() {
      return Util.sign( this.coefficient.getValue() );
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
             ( term.variable === this.variable ); // associated with same variable
    }
  } );
} );
 