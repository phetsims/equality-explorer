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
  var inherit = require( 'PHET_CORE/inherit' );
  var ReducedFraction = require( 'EQUALITY_EXPLORER/common/model/ReducedFraction' );
  var Term = require( 'EQUALITY_EXPLORER/common/model/Term' );

  /**
   * @param {TermCreator} termCreator
   * @param {Object} [options]
   * @constructor
   */
  function ConstantTerm( termCreator, options ) {

    options = _.extend( {
      constantValue: ReducedFraction.withInteger( 1 )
    }, options );

    assert && assert( options.constantValue instanceof ReducedFraction, 'invalid constantValue' );

    // @public (read-only) {ReducedFraction}
    this.constantValue = options.constantValue;

    Term.call( this, termCreator, options );
  }

  equalityExplorer.register( 'ConstantTerm', ConstantTerm );

  return inherit( Term, ConstantTerm, {

    /**
     * The weight of a constant term is the same as its value.
     * @returns {ReducedFraction}
     * @public
     * @override
     */
    get weight() {
      return this.constantValue;
    },

    /**
     * For debugging only. Do not rely on the format of toString.
     * @returns {string}
     * @public
     */
    toString: function() {

      // e.g. 'ConstantTerm: 5/3'
      return 'ConstantTerm: ' + this.constantValue;
    },

    /**
     * Is this term the inverse of a specified term?
     * Two constant terms are inverses if their values are inverses.
     * @param {Term} term
     * @returns {boolean}
     * @public
     * @override
     */
    isInverseOf: function( term ) {
      return ( term instanceof ConstantTerm ) &&
             ( this.constantValue.toDecimal() === -term.constantValue.toDecimal() );
    }
  } );
} );
 