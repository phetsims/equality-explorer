// Copyright 2018, University of Colorado Boulder

/**
 * Challenge generator for level 1.
 * See specification in https://docs.google.com/document/d/1vG5U9HhcqVGMvmGGXry28PLqlNWj25lStDP2vSWgUOo/edit.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ChallengeGenerator = require( 'EQUALITY_EXPLORER/solveit/model/ChallengeGenerator' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Range = require( 'DOT/Range' );

  // constants
  var X_RANGE = new Range( -40, 40 );
  var A_RANGE = new Range( -10, 10 );
  var B_RANGE = new Range( -10, 10 );
  var C_RANGE = new Range( -10, 10 );
  var D_RANGE = new Range( -10, 10 );

  /**
   * @constructor
   */
  function ChallengeGenerator1() {
    ChallengeGenerator.call( this, 1 /* level */ );
  }

  equalityExplorer.register( 'ChallengeGenerator1', ChallengeGenerator1 );

  return inherit( ChallengeGenerator, ChallengeGenerator1, {

    /**
     * Generates the next challenge.
     * @returns {Object}
     * @protected
     * @override
     */
    nextChallengeProtected: function() {
      var challenge;
      if ( this.numberOfChallenges < 3 ) {
        challenge = this.nextChallengeOfType( this.numberOfChallenges + 1 );
      }
      else {
        challenge = this.nextChallengeOfType( this.random.nextIntBetween( 1, 3 ) );
      }
      return challenge;
    },

    /**
     * Generates 3 types of challenge, as identified in the design document.
     * @param {number} type - 1, 2 or 3
     * @returns {Object}
     * @private
     */
    nextChallengeOfType: function( type ) {
      if ( type === 1 ) {
        return this.nextType1();
      }
      else if ( type === 2 ) {
        return this.nextType2();
      }
      else if ( type === 3 ) {
        return this.nextType3();
      }
      else {
        throw new Error( 'invalid type: ' + type );
      }
    },

    /**
     * Generates the next 'type 1' challenge.
     *
     * Form: ax = c
     * Let x be a random integer between [-40,40], x !== 0
     * Let a be a random integer between [-10, 10], a !== 0
     * Let c = a•x
     *
     * @returns {{level: number, type: number, x: number, a: number, c: number}}
     * @private
     */
    nextType1: function() {

      var x = this.nextXInRange( X_RANGE );
      var a = this.nextIntInRange( A_RANGE );
      var c = a * x;

      return { level: this.level, type: 1, x: x, a: a, c: c };
    },

    /**
     * Generates the next 'type 2' challenge.
     *
     * Form: x + b = c
     * Let x be a random integer between [-40,40], x !== 0
     * Let b be a random integer between [-10, 10], b !== 0
     * Let c = x + b
     *
     * @returns {{level: number, type: number, x: number, b: number, c: number}}
     * @private
     */
    nextType2: function() {

      var x = this.nextXInRange( X_RANGE );
      var b = this.nextIntInRange( B_RANGE );
      var c = x + b;

      return { level: this.level, type: 2, x: x, b: b, c: c };
    },

    /**
     * Generates the next 'type 3' challenge.
     *
     * Form: x/d = c
     * Let c be a random integer between [-10,10], c !== 0
     * Let d be a random integer between [-10, 10], d !== 0
     * Let x = c * d
     *
     * @returns {{level: number, type: number, x: number, c: number, d: number}}
     * @private
     */
    nextType3: function() {

      var x = this.xPrevious;
      while ( x === this.xPrevious ) {
        var c = this.nextIntInRange( C_RANGE );
        var d = this.nextIntInRange( D_RANGE );
        x = c * d;
      }
      this.xPrevious = x;

      return { level: this.level, type: 3, x: x, c: c, d: d };
    }
  } );
} );