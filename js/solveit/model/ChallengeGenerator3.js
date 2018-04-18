// Copyright 2018, University of Colorado Boulder

/**
 * Challenge generator for game level 3.
 * See specification in https://docs.google.com/document/d/1vG5U9HhcqVGMvmGGXry28PLqlNWj25lStDP2vSWgUOo/edit.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Challenge = require( 'EQUALITY_EXPLORER/solveit/model/Challenge' );
  var ChallengeGenerator = require( 'EQUALITY_EXPLORER/solveit/model/ChallengeGenerator' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var Fraction = require( 'PHETCOMMON/model/Fraction' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Range = require( 'DOT/Range' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // constants
  var X_RANGE = new Range( -40, 40 );
  var A_RANGE = new Range( -10, 10 );
  var B_RANGE = new Range( -10, 10 );
  var D_RANGE = new Range( -10, 10 );

  /**
   * @constructor
   */
  function ChallengeGenerator3() {
    ChallengeGenerator.call( this );
  }

  equalityExplorer.register( 'ChallengeGenerator3', ChallengeGenerator3 );

  return inherit( ChallengeGenerator, ChallengeGenerator3, {

    /**
     * Generates the next challenge.
     * @returns {Challenge}
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
     * Let d be a random integer between [-10, 10], d !== [0, a]
     * Let c = (a/d)x + b, c == 0 is OK
     *
     * @returns {Challenge}
     * @private
     */
    nextType1: function() {

      var x = this.nextXInRange( X_RANGE );
      var a = this.nextIntInRange( A_RANGE, [ 0 ] );
      var b = this.nextIntInRange( B_RANGE, [ 0 ] );
      var d = this.nextIntInRange( D_RANGE, [ 0, a ] );
      var c = new Fraction( a, d ).timesInteger( x ).plusInteger( b ).reduce();

      // Verify that computations meeting design requirements.
      assert && assert( x !== 0, 'x is 0' );
      assert && assert( a !== 0, 'a is 0' );
      assert && assert( b !== 0, 'b is 0' );
      assert && assert( d !== 0, 'd is 0' );
      assert && assert( d !== a, 'd === a: ' + d );

      // derivation that corresponds to design doc
      var debugOrigin = 'level 3, type 1, (a/d)x + b = c';
      var debugDerivation = StringUtils.fillIn( 'x={{x}}, a={{a}}, b={{b}}, d={{d}}, c=(a/d)x+b={{c}}', {
        x: x,
        a: a,
        b: b,
        c: c,
        d: d
      } );

      // (a/d)x + b = 0x + c
      return new Challenge( x,
        new Fraction( a, d ).reduce(), Fraction.fromInteger( b ),
        Fraction.ZERO, c,
        debugOrigin, debugDerivation );
    },

    /**
     * Generates the next 'type 2' challenge.
     *
     * Form: (a/d)x + (b/d) = c
     * Let x be a random integer between [-40,40], x !== 0
     * Let a be a random integer between [-10,10], a !== 0
     * Let b be a random integer between [-10,10], b !== 0
     * Let d be a random integer between [-10, 10], d !== 0
     * Let c = ( ax + b )/d, c == 0 is OK
     *
     * @returns @returns {Challenge}
     * @private
     */
    nextType2: function() {

      var x = this.nextXInRange( X_RANGE );
      var a = this.nextIntInRange( A_RANGE, [ 0 ] );
      var b = this.nextIntInRange( B_RANGE, [ 0 ] );
      var d = this.nextIntInRange( D_RANGE, [ 0 ] );
      var c = new Fraction( ( a * x ) + b, d ).reduce();

      // Verify that computations meeting design requirements.
      assert && assert( x !== 0, 'x is 0' );
      assert && assert( a !== 0, 'a is 0' );
      assert && assert( b !== 0, 'b is 0' );
      assert && assert( d !== 0, 'd is 0' );

      // derivation that corresponds to design doc
      var debugOrigin = 'level 3, type 2, (a/d)x + (b/d) = c';
      var debugDerivation = StringUtils.fillIn( 'x={{x}}, a={{a}}, b={{b}}, d={{d}}, c=(ax+b)/d={{c}}', {
        x: x,
        a: a,
        b: b,
        c: c,
        d: d
      } );

      // (a/d)x + (b/d) = 0x + c
      return new Challenge( x,
        new Fraction( a, d ).reduce(), new Fraction( b, d ).reduce(),
        Fraction.ZERO, c,
        debugOrigin, debugDerivation );
    }
  } );
} );