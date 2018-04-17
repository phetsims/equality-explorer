// Copyright 2018, University of Colorado Boulder

/**
 * Abstract base type for challenge generators.
 * See specification in https://docs.google.com/document/d/1vG5U9HhcqVGMvmGGXry28PLqlNWj25lStDP2vSWgUOo/edit.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @constructor
   * @abstract
   */
  function ChallengeGenerator() {

    // @public (read-only) number of challenges generated
    this.numberOfChallenges = 0;

    // @protected value of x for the previous challenge, so we don't use the same value for consecutive challenges.
    // The design document says "It’s OK to generate the same coefficient or constant for consecutive challenges.
    // Do not generate the exact same challenge (coefficient, constant, AND value for x) twice in a row." So we
    // only need to pick one quantity that is not the same, and we have chosen 'x', since it's common to all
    // challenges.
    this.xPrevious = 0;

    // @protected (read-only) {Random}
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
     * @returns {Challenge}
     * @public
     */
    nextChallenge: function() {
      var challenge = this.nextChallengeProtected();
      this.numberOfChallenges++;
      return challenge;
    },

    /**
     * Generates the next challenge for this level.
     * @returns {Challenge}
     * @protected
     * @abstract
     */
    nextChallengeProtected: function() {
      throw new Error( 'nextChallengeProtected must be implemented by subtype' );
    },

    /**
     * Gets the next integer in a range, excluding zero and one additional (optional) value.
     * @param {Range} range
     * @param {number} [excludedValue]
     * @returns {number}
     */
    nextIntInRange: function( range, excludedValue ) {
      excludedValue = excludedValue || 0;
      var value = 0;
      while ( value === 0 || value === excludedValue ) {
        value = this.random.nextIntBetween( range.min, range.max );
      }
      assert && assert( range.contains( value ), 'value is out of range: ' + value );
      assert && assert( value !== 0, 'value is 0' );
      return value;
    },

    /**
     * Gets the next value of x in a range, excluding zero and the previous value of x.
     * @param range
     * @returns {number}
     */
    nextXInRange: function( range ) {
      var x = this.nextIntInRange( range, this.xPrevious );
      assert && assert( range.contains( x ), 'x is out of range: ' + x );
      assert && assert( x !== 0, 'x is 0' );
      assert && assert( x !== this.xPrevious, 'x === xPrevious: ' + x );
      this.xPrevious = x;
      return x;
    }
  } );
} );