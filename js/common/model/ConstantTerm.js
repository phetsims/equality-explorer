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

  /**
   * @param {Object} [options]
   * @constructor
   */
  function ConstantTerm( options ) {

    options = _.extend( {
      constantValue: Fraction.fromInteger( 1 )
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
     * Gets the sign of a term.
     * @returns {number} ala Math.sign
     * @public
     * @override
     */
    get sign() {
      return Util.sign( this.constantValue.getValue() );
    },

    /**
     * Is this term a like term?
     * @param {Term} term
     * @returns {boolean}
     * @public
     * @override
     */
    isLikeTerm: function( term ) {
      return ( term instanceof ConstantTerm );
    },

    /**
     * Is this term the inverse of a specified term?
     * Two constant terms are inverses if their values are inverses.
     * @param {Term} term
     * @returns {boolean}
     * @public
     * @override
     */
    isInverseTerm: function( term ) {
      return ( term instanceof ConstantTerm ) &&
             ( this.constantValue.getValue() === -term.constantValue.getValue() );
    }
  } );
} );
 