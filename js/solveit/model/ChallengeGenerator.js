// Copyright 2018, University of Colorado Boulder

/**
 * Abstract base type for challenge generators.
 * See specification in https://docs.google.com/document/d/1vG5U9HhcqVGMvmGGXry28PLqlNWj25lStDP2vSWgUOo/edit.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Util = require( 'DOT/Util' );

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
      const challenge = this.nextChallengeProtected();
      this.numberOfChallenges++;
      return challenge;
    },

    /**
     * Subtype-specific method of generating the next challenge for this level.
     * @returns {Challenge}
     * @protected
     * @abstract
     */
    nextChallengeProtected: function() {
      throw new Error( 'nextChallengeProtected must be implemented by subtype' );
    },

    /**
     * Randomly samples a value for x from a set of values, excluding zero and the previous value of x.
     * @param {number[]} values
     * @returns {number}
     */
    randomX: function( values ) {
      const x = ChallengeGenerator.randomValue( values, [ 0, this.xPrevious ] );
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

      const values = []; // {number[]}
      for ( let i = min; i <= max; i++ ) {
        values.push( i );
      }
      return values;
    },

    /**
     * Randomly samples a value from a set of values, after filtering out values that don't meet some predicate.
     * @param {number[]} values
     * @param {function(number)} predicate - values that don't satisfy this predicate will be filtered out
     * @returns {number}
     */
    randomValueBy: function( values, predicate ) {
      const filteredValues = _.filter( values, predicate );
      assert && assert( filteredValues.length > 0, 'all values were excluded' );
      return phet.joist.random.sample( filteredValues );
    },

    /**
     * Randomly samples a value from a set of values, after excluding an optional set of values.
     * @param {number[]} values
     * @param {number[]} [excludedValues]
     * @returns {number}
     */
    randomValue: function( values, excludedValues ) {
      return ChallengeGenerator.randomValueBy( values, function( value ) {
        return !_.includes( excludedValues, value );
      } );
    }
  } );
} );