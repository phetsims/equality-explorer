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
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // constants
  var X_VALUES = ChallengeGenerator.rangeToArray( -40, 40 );
  var A_VALUES = ChallengeGenerator.rangeToArray( -10, 10 );
  var B_VALUES = ChallengeGenerator.rangeToArray( -10, 10 );
  var D_VALUES = ChallengeGenerator.rangeToArray( -10, 10 );

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
     * Let d be a random integer between [-10, 10], d !== 0
     * Let a be a random integer between [-10,10], a !== 0, a % d !== 0
     * Let b be a random integer between [-10,10], b !== 0
     * Let c = (a/d)x + b, c == 0 is OK
     *
     * @returns {Challenge}
     * @private
     */
    nextType1: function() {

      var x = this.randomX( X_VALUES );
      var d = this.randomValue( D_VALUES, [ 0, 1, -1 ] );
      var a = this.randomValueBy( A_VALUES, function( a ) { return ( a % d !== 0 ); } );
      var b = this.randomValue( B_VALUES, [ 0 ] );
      var c = new Fraction( a, d ).timesInteger( x ).plusInteger( b ).reduce();

      // Verify that computations meeting design requirements.
      assert && assert( x !== 0, 'x is 0' );
      assert && assert( d !== 0, 'd is 0' );
      assert && assert( a !== 0, 'a is 0' );
      assert && assert( a % d !== 0, 'a/d reduces to an integer, a=' + a + ', d=' + d );
      assert && assert( b !== 0, 'b is 0' );

      // derivation that corresponds to design doc, displayed with 'showAnswers' query parameter
      var pattern = 'level 3, type 1, (a/d)x + b = c<br>x = {{x}}<br>d = {{d}}<br>a = {{a}}<br>b = {{b}}, c = (a/d)x + b = {{c}}';
      var debugDerivation = StringUtils.fillIn( pattern, {
        x: x,
        a: a,
        b: b,
        c: c,
        d: d
      } );

      // (a/d)x + b = 0x + c
      return new Challenge( x, new Fraction( a, d ).reduce(), Fraction.fromInteger( b ), Fraction.ZERO, c,
        debugDerivation );
    },

    /**
     * Generates the next 'type 2' challenge.
     *
     * Form: (a/d)x + (b/d) = c
     * Let x be a random integer between [-40,40], x !== 0
     * Let d be a random integer between [-10, 10], d !== [0, 1, -1]
     * Let a be a random integer between [-10,10], a !== 0, a % d !== 0
     * Let b be a random integer between [-10,10], b !== 0, b % d !== 0
     * Let c = ( ax + b )/d, c == 0 is OK
     *
     * @returns @returns {Challenge}
     * @private
     */
    nextType2: function() {

      var x = this.randomX( X_VALUES );
      var d = this.randomValue( D_VALUES, [ 0, 1, -1 ] );
      var a = this.randomValueBy( A_VALUES, function( a ) { return ( a % d !== 0 ); } );
      var b = this.randomValueBy( B_VALUES, function( b ) { return ( b % d !== 0 ); } );
      var c = new Fraction( ( a * x ) + b, d ).reduce();

      // Verify that computations meeting design requirements.
      assert && assert( x !== 0, 'x is 0' );
      assert && assert( d !== 0, 'd is 0' );
      assert && assert( a !== 0, 'a is 0' );
      assert && assert( a % d !== 0, 'a/d reduces to an integer, a=' + a + ', d=' + d );
      assert && assert( b !== 0, 'b is 0' );
      assert && assert( b % d !== 0, 'b/d reduces to an integer, b=' + b + ', d=' + d );

      // derivation that corresponds to design doc, displayed with 'showAnswers' query parameter
      var pattern = 'level 3, type 2, (a/d)x + (b/d) = c<br>x = {{x}}<br>d = {{d}}<br>a = {{a}}<br>b = {{b}}<br>c = (ax + b)/d = {{c}}';
      var debugDerivation = StringUtils.fillIn( pattern, {
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
        debugDerivation );
    }
  } );
} );