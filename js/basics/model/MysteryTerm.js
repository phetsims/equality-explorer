// Copyright 2017-2018, University of Colorado Boulder

/**
 * MysteryTerm has a fixed weight that is exposed to the user.
 * All mystery terms have an implicit coefficient of 1.
 * The visual design of interactive mystery terms does not include a coefficient.
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

  /**
   * @param {MysteryObject} mysteryObject
   * @param {TermCreator} termCreator
   * @param {Object} [options]
   * @constructor
   */
  function MysteryTerm( mysteryObject, termCreator, options ) {

    // @public (read-only)
    this.mysteryObject = mysteryObject;

    Term.call( this, termCreator, options );
  }

  equalityExplorer.register( 'MysteryTerm', MysteryTerm );

  return inherit( Term, MysteryTerm, {

    /**
     * Gets the weight of this term.
     * @returns {Fraction}
     * @public
     * @override
     */
    get weight() {
      return Fraction.fromInteger( this.mysteryObject.weight );
    },

    /**
     * For debugging only. Do not rely on the format of toString.
     * @returns {string}
     * @public
     */
    toString: function() {

      // e.g. 'MysteryTerm: turtle 6'
      return 'MysteryTerm: ' + this.mysteryObject.name + ' ' + this.mysteryObject.weight;
    },

    /**
     * Is this term a like term?
     * @param {Term} term
     * @returns {boolean}
     * @public
     * @override
     */
    isLikeTerm: function( term ) {
      return ( term instanceof MysteryTerm ) && ( term.mysteryObject === this.mysteryObject );
    },

    /**
     * Is this term the inverse of a specified term?
     * @param {Term} term
     * @returns {boolean}
     * @public
     * @override
     */
    isInverseTerm: function( term ) {
      return false; // there are no inverses for mystery terms
    }
  } );
} );
 