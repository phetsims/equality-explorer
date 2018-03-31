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
  var Fraction = require( 'PHETCOMMON/model/Fraction' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Term = require( 'EQUALITY_EXPLORER/common/model/Term' );
  var Util = require( 'DOT/Util' );

  // constants
  var DEFAULT_CONSTANT_VALUE = Fraction.fromInteger( 1 );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function ConstantTerm( options ) {

    options = _.extend( {
      constantValue: DEFAULT_CONSTANT_VALUE
    }, options );

    assert && assert( options.constantValue instanceof Fraction,
      'invalid constantValue: ' + options.constantValue );
    assert && assert( options.constantValue.isReduced(),
      'constantValue must be reduced: ' + options.constantValue );

    // @public (read-only) {Fraction}
    this.constantValue = options.constantValue;

    Term.call( this, options );
  }

  equalityExplorer.register( 'ConstantTerm', ConstantTerm );

  return inherit( Term, ConstantTerm, {

    /**
     * For debugging only. Do not rely on the format of toString.
     * @returns {string}
     * @public
     */
    toString: function() {

      // e.g. 'ConstantTerm: 5/3'
      return 'ConstantTerm: ' + this.constantValue;
    },

    //-------------------------------------------------------------------------------------------------
    // Below here is the implementation of the Term API
    //-------------------------------------------------------------------------------------------------

    /**
     * The weight of a constant term is the same as its value.
     * @returns {Fraction}
     * @public
     * @override
     */
    get weight() {
      return this.constantValue;
    },

    /**
     * Gets the sign of a term's significant number, indicating whether the number is positive, negative or zero.
     * The 'significant number' for a ContantTerm is its constantValue.
     * @returns {number} ala Math.sign
     * @public
     * @override
     */
    get sign() {
      return Util.sign( this.constantValue.getValue() );
    },

    /**
     * Are this term and the specified term 'like terms'?
     * All constant terms are like terms.
     * @param {Term} term
     * @returns {boolean}
     * @public
     * @override
     */
    isLikeTerm: function( term ) {
      return ( term instanceof ConstantTerm );
    },

    /**
     * Gets the value that is considered 'significant' for the purposes of exceeding the number limit
     * specified by EqualityExplorerConstants.LARGEST_INTEGER.
     * See https://github.com/phetsims/equality-explorer/issues/48
     * @returns {Fraction}
     * @protected
     * @override
     */
    getSignificantValue: function() {
      return this.constantValue;
    },

    /**
     * Creates options that can be passed to the Term's constructor to re-create the Term.
     * @return {Object}
     * @public
     * @override
     */
    createSnapshot: function() {
      return _.extend( Term.prototype.createSnapshot.call( this ), {
        constantValue: this.constantValue
      } );
    }
  } );
} );
 