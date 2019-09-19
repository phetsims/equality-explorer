// Copyright 2018, University of Colorado Boulder

/**
 * Challenge generator for game level 3.
 * See specification in https://docs.google.com/document/d/1vG5U9HhcqVGMvmGGXry28PLqlNWj25lStDP2vSWgUOo/edit.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Challenge = require( 'EQUALITY_EXPLORER/solveit/model/Challenge' );
  const ChallengeGenerator = require( 'EQUALITY_EXPLORER/solveit/model/ChallengeGenerator' );
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const Fraction = require( 'PHETCOMMON/model/Fraction' );
  const inherit = require( 'PHET_CORE/inherit' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // strings (debug)
  var PATTERN1 = 'level 3, type 1, (a/d)x + b = c<br>' +
                 'x = {{x}}<br>' +
                 'd = {{d}}<br>' +
                 'a = {{a}}<br>' +
                 'b = {{b}}<br>' +
                 'c = (a/d)x + b = {{c}}';
  var PATTERN2 = 'level 3, type 2, (a/d)x + b/d = c<br>' +
                 'x = {{x}}<br>' +
                 'd = {{d}}<br>' +
                 'a = {{a}}<br>' +
                 'b = {{b}}<br>' +
                 'c = (ax + b)/d = {{c}}';

  // constants
  var X_VALUES = ChallengeGenerator.rangeToArray( -40, 40 );
  var A_VALUES = ChallengeGenerator.rangeToArray( -10, 10 );
  var B_VALUES_TYPE1 = ChallengeGenerator.rangeToArray( -3, 3 );
  var B_VALUES_TYPE2 = ChallengeGenerator.rangeToArray( -10, 10 );
  var D_VALUES = ChallengeGenerator.rangeToArray( -10, 10 );

  /**
   * @constructor
   */
  function ChallengeGenerator3() {
    ChallengeGenerator.call( this );

    // @private methods for generating the 2 types of challenges
    this.challengeTypeMethods = [ this.nextType1.bind( this ), this.nextType2.bind( this ) ];
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

      // Randomly select the type of challenge to generate.
      return phet.joist.random.sample( this.challengeTypeMethods )();
    },

    /**
     * Generates the next 'type 1' challenge.
     *
     * Form: (a/d)x + b = c
     * Let x be a random integer between [-40,40], x !== 0
     * Let d be a random integer between [-10, 10], d !== [0,1,-1]
     * Let a be a random integer between [-10,10], a % d !== 0
     * Let b be a random integer between [-10,10], b !== 0
     * Let c = (a/d)x + b, c == 0 is OK
     *
     * @returns {Challenge}
     * @private
     */
    nextType1: function() {

      var x = this.randomX( X_VALUES );
      var d = ChallengeGenerator.randomValue( D_VALUES, [ 0, 1, -1 ] );
      var a = ChallengeGenerator.randomValueBy( A_VALUES, function( a ) { return ( a % d !== 0 ); } );
      var b = ChallengeGenerator.randomValue( B_VALUES_TYPE1, [ 0 ] );
      var c = new Fraction( a, d ).timesInteger( x ).plusInteger( b ).reduce();

      // Verify that computations meeting design requirements.
      assert && assert( x !== 0, 'x is 0' );
      assert && assert( d !== 0, 'd is 0' );
      assert && assert( a % d !== 0, 'a/d reduces to an integer, a=' + a + ', d=' + d );
      assert && assert( b !== 0, 'b is 0' );

      // Verify that we fixed the 'too many steps to solve' problem.
      // see https://github.com/phetsims/equality-explorer/issues/38#issuecomment-384761619
      var bd = b * d;
      assert && assert( bd >= -30 && bd <= 30, '(b * d) out of range: ' + bd );

      // derivation that corresponds to design doc, displayed with 'showAnswers' query parameter
      var debugDerivation = StringUtils.fillIn( PATTERN1, { x: x, a: a, b: b, c: c, d: d } );

      // (a/d)x + b = 0x + c
      return new Challenge( x,
        new Fraction( a, d ).reduce(), Fraction.fromInteger( b ),
        Fraction.fromInteger( 0 ), c,
        debugDerivation );
    },

    /**
     * Generates the next 'type 2' challenge.
     *
     * Form: (a/d)x + (b/d) = c
     * Let x be a random integer between [-40,40], x !== 0
     * Let d be a random integer between [-10, 10], d !== [0, 1, -1]
     * Let a be a random integer between [-10,10], a % d !== 0
     * Let b be a random integer between [-10,10], b % d !== 0
     * Let c = ( ax + b )/d, c == 0 is OK
     *
     * @returns @returns {Challenge}
     * @private
     */
    nextType2: function() {

      var x = this.randomX( X_VALUES );
      var d = ChallengeGenerator.randomValue( D_VALUES, [ 0, 1, -1 ] );
      var a = ChallengeGenerator.randomValueBy( A_VALUES, function( a ) { return ( a % d !== 0 ); } );
      var b = ChallengeGenerator.randomValueBy( B_VALUES_TYPE2, function( b ) { return ( b % d !== 0 ); } );
      var c = new Fraction( ( a * x ) + b, d ).reduce();

      // Verify that computations meeting design requirements.
      assert && assert( x !== 0, 'x is 0' );
      assert && assert( d !== 0, 'd is 0' );
      assert && assert( a % d !== 0, 'a/d reduces to an integer, a=' + a + ', d=' + d );
      assert && assert( b % d !== 0, 'b/d reduces to an integer, b=' + b + ', d=' + d );

      // derivation that corresponds to design doc, displayed with 'showAnswers' query parameter
      var debugDerivation = StringUtils.fillIn( PATTERN2, { x: x, a: a, b: b, c: c, d: d } );

      // (a/d)x + (b/d) = 0x + c
      return new Challenge( x,
        new Fraction( a, d ).reduce(), new Fraction( b, d ).reduce(),
        Fraction.fromInteger( 0 ), c,
        debugDerivation );
    }
  } );
} );