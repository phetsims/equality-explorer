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
  var Util = require( 'DOT/Util' );

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
     * Gets the next integer in a range, with optional values to be excluded.
     * @param {number[]} values
     * @param {number[]} [excludedValues]
     * @returns {number}
     */
    nextValue: function( values, excludedValues ) {
      var difference = _.difference( values, excludedValues );
      assert && assert( difference.length > 0, 'all values were excluded' );
      return this.random.sample( difference );
    },

    /**
     * Gets the next value of x from a set of values, excluding zero and the previous value of x.
     * @param {number[]} values
     * @returns {number}
     */
    nextX: function( values ) {
      var x = this.nextValue( values, [ 0, this.xPrevious ] );
      assert && assert( x !== 0, 'x is 0' );
      assert && assert( x !== this.xPrevious, 'x === xPrevious: ' + x );
      this.xPrevious = x;
      return x;
    }
  }, {

    /**
     * Converts an integer range to an array of integer values.
     * @param {number} min
     * @param {number} max
     * @returns {number[]}
     * @public
     * @static
     */
    rangeToArray: function( min, max ) {

      assert && assert( Util.isInteger( min ), 'min must be an integer: ' + min );
      assert && assert( Util.isInteger( max ), 'max must be an integer: ' + max );

      var values = []; // {number[]}
      for ( var i = min; i <= max; i++ ) {
        values.push( i );
      }
      return values;
    }
  } );
} );