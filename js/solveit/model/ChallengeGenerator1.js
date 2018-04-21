// Copyright 2018, University of Colorado Boulder

/**
 * Challenge generator for game level 1.
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

  // strings (debug)
  var PATTERN1 = 'level 1, type 1, ax = c<br>' +
                 'x = {{x}}<br>' +
                 'a = {{a}}<br>' +
                 'c = a * x = {{c}}';
  var PATTERN2 = 'level 1, type 2, x + b = c<br>' +
                 'x = {{x}}<br>' +
                 'b = {{b}}<br>' +
                 'c = x + b = {{c}}';
  var PATTERN3 = 'level 1, type 3, x/d = c<br>' +
                 'c = {{c}}<br>' +
                 'd = {{d}}<br>' +
                 'x = c * d = {{x}} ';

  // constants
  var X_VALUES = ChallengeGenerator.rangeToArray( -40, 40 );
  var A_VALUES = ChallengeGenerator.rangeToArray( -10, 10 );
  var B_VALUES = ChallengeGenerator.rangeToArray( -10, 10 );
  var C_VALUES = ChallengeGenerator.rangeToArray( -10, 10 );
  var D_VALUES = ChallengeGenerator.rangeToArray( -10, 10 );

  /**
   * @constructor
   */
  function ChallengeGenerator1() {
    ChallengeGenerator.call( this );
  }

  equalityExplorer.register( 'ChallengeGenerator1', ChallengeGenerator1 );

  return inherit( ChallengeGenerator, ChallengeGenerator1, {

    /**
     * Generates the next challenge.
     * @returns {Challenge}
     * @protected
     * @override
     */
    nextChallengeProtected: function() {
      var challenge;
      if ( this.numberOfChallenges < 3 ) {
        challenge = this.nextChallengeForType( this.numberOfChallenges + 1 );
      }
      else {
        challenge = this.nextChallengeForType( this.random.nextIntBetween( 1, 3 ) );
      }
      return challenge;
    },

    /**
     * Generates the next challenge for one of the 'types' identified in the design document.
     * @param {number} type - 1, 2 or 3
     * @returns {Challenge}
     * @private
     */
    nextChallengeForType: function( type ) {
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
     * Let a be a random integer between [-10, 10], a !== [0, 1]
     * Let c = a*x, c !== 0
     *
     * @returns {Challenge}
     * @private
     */
    nextType1: function() {

      var x = this.randomX( X_VALUES );
      var a = this.randomValue( A_VALUES, [ 0, 1 ] );
      var c = a * x;

      // Verify that computations meeting design requirements.
      assert && assert( x !== 0, 'x is 0' );
      assert && assert( a !== 0, 'a is 0' );
      assert && assert( c !== 0, 'c is 0' );

      // derivation that corresponds to design doc, displayed with 'showAnswers' query parameter
      var debugDerivation = StringUtils.fillIn( PATTERN1, {
        x: x,
        a: a,
        c: c
      } );

      // ax + 0 = 0x + c
      return new Challenge( x,
        Fraction.fromInteger( a ), Fraction.fromInteger( 0 ),
        Fraction.fromInteger( 0 ), Fraction.fromInteger( c ),
        debugDerivation );
    },

    /**
     * Generates the next 'type 2' challenge.
     *
     * Form: x + b = c
     * Let x be a random integer between [-40,40], x !== 0
     * Let b be a random integer between [-10, 10], b !== 0
     * Let c = x + b, c == 0 is OK
     *
     * @returns {Challenge}
     * @private
     */
    nextType2: function() {

      var x = this.randomX( X_VALUES );
      var b = this.randomValue( B_VALUES, [ 0 ] );
      var c = x + b;

      // Verify that computations meeting design requirements.
      assert && assert( x !== 0, 'x is 0' );
      assert && assert( b !== 0, 'b is 0' );

      // derivation that corresponds to design doc, displayed with 'showAnswers' query parameter
      var debugDerivation = StringUtils.fillIn( PATTERN2, {
        x: x,
        b: b,
        c: c
      } );

      // 1x + b = 0x + c
      return new Challenge( x,
        Fraction.fromInteger( 1 ), Fraction.fromInteger( b ),
        Fraction.fromInteger( 0 ), Fraction.fromInteger( c ),
        debugDerivation );
    },

    /**
     * Generates the next 'type 3' challenge.
     *
     * Form: x/d = c
     * Let c be a random integer between [-10,10], c !== 0
     * Let d be a random integer between [-10, 10], d !== [0, 1]
     * Let x = c * d, x !== 0
     *
     * @returns {Challenge}
     * @private
     */
    nextType3: function() {

      var x = this.xPrevious;
      while ( x === this.xPrevious ) {
        var c = this.randomValue( C_VALUES, [ 0 ] );
        var d = this.randomValue( D_VALUES, [ 0, 1 ] );
        x = c * d;
      }

      // Verify that computations meeting design requirements.
      assert && assert( c !== 0, 'c is 0' );
      assert && assert( d !== 0, 'd is 0' );
      assert && assert( d !== 1, 'd is 1' );
      assert && assert( x !== 0, 'x is 0' );
      assert && assert( x !== this.xPrevious, 'x === xPrevious: ' + x );
      this.xPrevious = x;

      // derivation that corresponds to design doc, displayed with 'showAnswers' query parameter
      var debugDerivation = StringUtils.fillIn( PATTERN3, {
        x: x,
        c: c,
        d: d
      } );

      // (1/d)x + 0 = 0x + c
      return new Challenge( x,
        new Fraction( 1, d ), Fraction.fromInteger( 0 ),
        Fraction.fromInteger( 0 ), Fraction.fromInteger( c ),
        debugDerivation );
    }
  } );
} );