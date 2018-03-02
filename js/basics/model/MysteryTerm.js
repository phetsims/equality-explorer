// Copyright 2018, University of Colorado Boulder

/**
 * MysteryTerm has a fixed weight that is exposed to the user.
 * All mystery terms have an implicit coefficient of 1. Their visual design does not accommodate a coefficient.
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
     * Gets the weight of this term.
     * @returns {ReducedFraction}
     * @public
     * @override
     */
    get weight() {
      return ReducedFraction.withInteger( this.mysteryObject.weight );
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
     * Is this term the inverse of a specified term?
     * @param {Term} term
     * @returns {boolean}
     * @public
     * @override
     */
    isInverseOf: function( term ) {
      return false; // there are no inverses for mystery terms
    }
  } );
} );
 