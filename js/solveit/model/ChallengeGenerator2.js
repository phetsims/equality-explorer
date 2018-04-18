// Copyright 2018, University of Colorado Boulder

/**
 * Challenge generator for game level 2.
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

  /**
   * @constructor
   */
  function ChallengeGenerator2() {
    ChallengeGenerator.call( this );
  }

  equalityExplorer.register( 'ChallengeGenerator2', ChallengeGenerator2 );

  return inherit( ChallengeGenerator, ChallengeGenerator2, {

    /**
     * Generates the next challenge.
     *
     * Form: ax + b = c
     * Let x be a random integer between [-40,40], x !== 0
     * Let a be a random integer between [-10,10], a !== 0
     * Let b be a random integer between [-10,10], b !== 0
     * Let c = ax + b, c == 0 is OK
     *
     * @returns {Challenge}
     * @protected
     * @override
     */
    nextChallengeProtected: function() {

      var x = this.nextX( X_VALUES );
      var a = this.nextValue( A_VALUES, [ 0 ] );
      var b = this.nextValue( B_VALUES, [ 0 ] );
      var c = ( a * x ) + b;

      // Verify that computations meeting design requirements.
      assert && assert( x !== 0, 'x is 0' );
      assert && assert( a !== 0, 'a is 0' );
      assert && assert( b !== 0, 'b is 0' );

      // derivation that corresponds to design doc
      var debugOrigin = 'level 2, ax + b = c';
      var debugDerivation = StringUtils.fillIn( 'x={{x}}, a={{a}}, b={{b}}, c=ax+b={{c}}', {
        x: x,
        a: a,
        b: b,
        c: c
      } );

      // ax + b = 0x + c
      return new Challenge( x,
        Fraction.fromInteger( a ), Fraction.fromInteger( b ),
        Fraction.ZERO, Fraction.fromInteger( c ),
        debugOrigin, debugDerivation );
    }
  } );
} );