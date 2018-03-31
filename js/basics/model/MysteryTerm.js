// Copyright 2017-2018, University of Colorado Boulder

/**
 * MysteryTerm has a fixed weight that is hidden from the user.
 * All interactive mystery terms represent 1 mystery object, and have an implicit coefficient of 1.
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
   * @param {Object} [options]
   * @constructor
   */
  function MysteryTerm( mysteryObject, options ) {

    // @public (read-only)
    this.mysteryObject = mysteryObject;

    Term.call( this, options );
  }

  equalityExplorer.register( 'MysteryTerm', MysteryTerm );

  return inherit( Term, MysteryTerm, {

    /**
     * For debugging only. Do not rely on the format of toString.
     * @returns {string}
     * @public
     */
    toString: function() {

      // e.g. 'MysteryTerm: turtle 6'
      return 'MysteryTerm: ' + this.mysteryObject.name + ' ' + this.mysteryObject.weight;
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
      return Fraction.fromInteger( this.mysteryObject.weight );
    },

    /**
     * Gets the sign of a term's significant number, indicating whether the number is positive, negative or zero.
     * @returns {number} ala Math.sign
     * @public
     * @override
     */
    get sign() {
      return 1; // all mystery terms have an implicit coefficient of +1, so sign is 1
    },

    /**
     * Are this term and the specified term 'like terms'?
     * Mystery terms are 'like' if they are associated with the same mystery object.
     * @param {Term} term
     * @returns {boolean}
     * @public
     * @override
     */
    isLikeTerm: function( term ) {
      return ( term instanceof MysteryTerm ) && ( term.mysteryObject === this.mysteryObject );
    }
  } );
} );
 