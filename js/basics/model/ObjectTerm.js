// Copyright 2017-2018, University of Colorado Boulder

/**
 * ObjectTerm is a term associated with some type of real-world object (shapes, fruits, coins, animals).
 * All interactive object terms represent 1 object, and have an implicit coefficient of 1.
 * The visual design of interactive object terms does not support a coefficient.
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

  // constants
  var COEFFICIENT = Fraction.fromInteger( 1 ); // all object terms have an implicit coefficient of 1

  /**
   * @param {ObjectVariable} variable
   * @param {Object} [options]
   * @constructor
   */
  function ObjectTerm( variable, options ) {

    options = options || {};
    assert && assert( !options.constantValue, 'constantValue is a ConstantTerm option' );
    assert && assert( !options.coefficient, 'coefficient is a VariableTerm option' );

    // @public (read-only)
    this.variable = variable;

    Term.call( this, COEFFICIENT, options );
  }

  equalityExplorer.register( 'ObjectTerm', ObjectTerm );

  return inherit( Term, ObjectTerm, {

    /**
     * For debugging only. Do not rely on the format of toString.
     * @returns {string}
     * @public
     */
    toString: function() {
      return 'ObjectTerm: ' + this.variable.symbol + ' ' + this.variable.valueProperty.value;
    },

    //-------------------------------------------------------------------------------------------------
    // Below here is the implementation of the Term API
    //-------------------------------------------------------------------------------------------------

    /**
     * Creates a copy of this term, with modifications through options.
     * @param {Object} [options] - same as constructor options
     * @returns {ObjectTerm}
     * @public
     * @override
     */
    copy: function( options ) {
      return new ObjectTerm( this.variable, _.extend( this.copyOptions(), options ) );
    },

    /**
     * Gets the weight of this term.
     * @returns {Fraction}
     * @public
     * @override
     */
    get weight() {
      return Fraction.fromInteger( this.variable.valueProperty.value );
    },

    /**
     * Are this term and the specified term 'like terms'?
     * ObjectTerms are 'like' if they are associated with the same variable.
     * @param {Term} term
     * @returns {boolean}
     * @public
     * @override
     */
    isLikeTerm: function( term ) {
      return ( term instanceof ObjectTerm ) && ( term.variable === this.variable );
    },

    /**
     * Applies an operation to this term, resulting in a new term.
     * @param {UniversalOperation} operation
     * @param {Object} [options] - same as constructor
     * @returns {ObjectTerm|null} - null if the operation is not applicable to this term.
     * @public
     * @override
     */
    applyOperation: function( operation, options ) {
      return null; // operations are not applicable to these terms
    }
  } );
} );
 