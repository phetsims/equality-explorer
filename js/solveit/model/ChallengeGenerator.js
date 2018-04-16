// Copyright 2018, University of Colorado Boulder

/**
 * Abstract base type for challenge generators.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {number} level
   * @constructor
   * @abstract
   */
  function ChallengeGenerator( level ) {

    // @public (read-only)
    this.level = level;

    // @public (read-only) number of challenges generated
    this.numberOfChallenges = 0;

    // @protected value of x for the previous challenge, so we don't use the same value for consecutive challenges
    this.xPrevious = 0;

    // @protected {Random}
    this.random = phet.joist.random;
  }

  equalityExplorer.register( 'ChallengeGenerator', ChallengeGenerator );

  return inherit( Object, ChallengeGenerator, {

    /**
     * @public
     */
    reset: function() {
      this.numberOfChallenges = 0;
    },

    /**
     * Generates the next challenge for this level.
     * @returns {Object}
     * @public
     */
    nextChallenge: function() {
      var challenge = this.nextChallengeProtected();
      this.numberOfChallenges++;
      return challenge;
    },

    /**
     * Generates the next challenge for this level.
     * @returns {Object}
     * @protected
     * @abstract
     */
    nextChallengeProtected: function() {
      throw new Error( 'nextChallengeProtected must be implemented by subtype' );
    },

    /**
     * Gets the next integer between min and max, excluding zero.
     * @param {Range} range
     * @returns {number}
     */
    nextIntInRange: function( range ) {
      var value = 0;
      while ( value === 0 ) {
        value = this.random.nextIntBetween( range.min, range.max );
      }
      return value;
    },

    /**
     * Gets the next x value between min and max, excluding zero and the previous x value.
     * @param {Range} range
     * @returns {number}
     */
    nextXInRange: function( range ) {
      var x = 0;
      while ( x === 0 || x === this.xPrevious ) {
        x = this.random.nextIntBetween( range.min, range.max );
      }
      this.xPrevious = x;
      return x;
    }
  } );
} );