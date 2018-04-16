// Copyright 2018, University of Colorado Boulder

/**
 * Challenge generator for level 3.
 * See specification in https://docs.google.com/document/d/1vG5U9HhcqVGMvmGGXry28PLqlNWj25lStDP2vSWgUOo/edit.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ChallengeGenerator = require( 'EQUALITY_EXPLORER/solveit/model/ChallengeGenerator' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var Fraction = require( 'PHETCOMMON/model/Fraction' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Range = require( 'DOT/Range' );

  // constants
  var X_RANGE = new Range( -40, 40 );
  var A_RANGE = new Range( -10, 10 );
  var B_RANGE = new Range( -10, 10 );
  var D_RANGE = new Range( -10, 10 );

  /**
   * @constructor
   */
  function ChallengeGenerator3() {
    ChallengeGenerator.call( this, 3 /* level */ );
  }

  equalityExplorer.register( 'ChallengeGenerator3', ChallengeGenerator3 );

  return inherit( ChallengeGenerator, ChallengeGenerator3, {

    /**
     * Generates the next challenge.
     * @returns {Object}
     * @protected
     * @override
     */
    nextChallengeProtected: function() {
      var type = this.random.nextIntBetween( 1, 2 );
      if ( type === 1 ) {
        return this.nextType1();
      }
      else {
        return this.nextType2();
      }
    },

    /**
     * Generates the next 'type 1' challenge.
     *
     * Form: (a/d)x + b = c
     * Let x be a random integer between [-40,40], x !== 0
     * Let a be a random integer between [-10,10], a !== 0
     * Let b be a random integer between [-10,10], b !== 0
     * Let d be a random integer between [-10, 10], d !== 0
     * Let c = (a/d)x + b
     *
     * @returns {{level: number, type: number, x: number, a: number, b: number, d: number, c: Fraction}}
     * @private
     */
    nextType1: function() {

      var x = this.nextXInRange( X_RANGE );
      var a = this.nextIntInRange( A_RANGE );
      var b = this.nextIntInRange( B_RANGE );
      var d = this.nextIntInRange( D_RANGE );
      var c = new Fraction( a, d ).timesInteger( x ).plusInteger( b );

      return { level: this.level, type: 1, x: x, a: a, b: b, d: d, c: c };
    },

    /**
     * Generates the next 'type 2' challenge.
     *
     * Form: (a/d)x + (b/d) = c
     * Let x be a random integer between [-40,40], x !== 0
     * Let a be a random integer between [-10,10], a !== 0
     * Let b be a random integer between [-10,10], b !== 0
     * Let d be a random integer between [-10, 10], d !== 0
     * Let c = ( ax + b )/d
     *
     * @returns @returns {{level: number, type: number, x: number, a: number, b: number, d: number, c: Fraction}}
     * @private
     */
    nextType2: function() {

      var x = this.nextXInRange( X_RANGE );
      var a = this.nextIntInRange( A_RANGE );
      var b = this.nextIntInRange( B_RANGE );
      var d = this.nextIntInRange( D_RANGE );
      var c = new Fraction( ( a * x ) + b, d );

      return { level: this.level, type: 2, x: x, a: a, b: b, d: d, c: c };
    }
  } );
} );