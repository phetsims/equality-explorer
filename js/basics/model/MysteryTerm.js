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
  var Util = require( 'DOT/Util' );

  /**
   * @param {string} typeName - internal name of the mystery object type, not visible to the user
   * @param {number} weight
   * @param {HTMLImageElement} image
   * @param {HTMLImageElement} shadow
   * @param {Object} [options]
   * @constructor
   */
  function MysteryTerm( typeName, weight, image, shadow, options ) {

    assert && assert( Util.isInteger( weight ), 'weight must be an integer: ' + weight );

    // @public (read-only)
    this.typeName = typeName;
    this.image = image;
    this.shadow = shadow;

    // @private
    this._weight = weight;

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
      return ReducedFraction.withInteger( this._weight );
    },

    /**
     * For debugging only. Do not rely on the format of toString.
     * @returns {string}
     * @public
     */
    toString: function() {
      return 'MysteryTerm:' + ' typeName=' + this.typeName + ' weight=' + this._weight;
    },

    /**
     * Is this term the inverse of a specified term?
     * Two mystery terms are inverses if they represent the same mystery object and have inverse weights.
     * @param {Term} term
     * @returns {boolean}
     * @public
     * @override
     */
    isInverseOf: function( term ) {
      return ( term instanceof MysteryTerm ) &&
             ( term.typeName === this.typeName ) && // same mystery object type
             ( term._weight === -this._weight ); // inverse weights
    }
  } );
} );
 