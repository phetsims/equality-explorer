// Copyright 2018, University of Colorado Boulder

/**
 * Challenge generator for game level 4.
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
  var PATTERN = 'level 4, ax + b = mx + n<br>' +
                'x = {{x}}<br>' +
                'a = {{a}}<br>' +
                'b = {{b}}<br>' +
                'm = {{m}}<br>' +
                'n = (a–m)x + b = {{n}}';

  // constants
  var X_VALUES = ChallengeGenerator.rangeToArray( -40, 40 );
  var A_VALUES = ChallengeGenerator.rangeToArray( -10, 10 );
  var B_VALUES = ChallengeGenerator.rangeToArray( -10, 10 );
  var M_VALUES = ChallengeGenerator.rangeToArray( -10, 10 );

  /**
   * @constructor
   */
  function ChallengeGenerator4() {
    ChallengeGenerator.call( this );
  }

  equalityExplorer.register( 'ChallengeGenerator4', ChallengeGenerator4 );

  return inherit( ChallengeGenerator, ChallengeGenerator4, {

    /**
     * Generates the next challenge.
     *
     * Form: ax + b = mx + n
     * Let x be a random integer between [-40,40], x !== 0
     * Let a be a random integer between [-10,10], a !== 0
     * Let b be a random integer between [-10,10], b !== 0
     * Let m be a random integer between [-10,10], m !== 0, m !== a, |a-m| <= 10
     * Let n = (a – m)x + b, n == 0 is OK
     *
     * @returns {Challenge}
     * @protected
     * @override
     */
    nextChallengeProtected: function() {

      var x = this.randomX( X_VALUES );
      var a = ChallengeGenerator.randomValue( A_VALUES, [ 0 ] );
      var b = ChallengeGenerator.randomValue( B_VALUES, [ 0 ] );
      var m = ChallengeGenerator.randomValueBy( M_VALUES, function( m ) {
        return ( m !== 0 ) && ( m !== a ) && ( Math.abs( a - m ) <= 10 );
      } );
      var n = ( ( a - m ) * x ) + b;

      // Verify that computations meeting design requirements.
      assert && assert( x !== 0, 'x is 0' );
      assert && assert( a !== 0, 'a is 0' );
      assert && assert( b !== 0, 'b is 0' );
      assert && assert( m !== 0, 'm is 0' );
      assert && assert( m !== a, 'm === a: ' + m );
      assert && assert( Math.abs( a - m ) <= 10, '|a-m| is too large: ' + Math.abs( a - m ) );

      // derivation that corresponds to design doc, displayed with 'showAnswers' query parameter
      var debugDerivation = StringUtils.fillIn( PATTERN, { x: x, a: a, b: b, m: m, n: n } );

      // ax + b = mx + n
      return new Challenge( x,
        Fraction.fromInteger( a ), Fraction.fromInteger( b ),
        Fraction.fromInteger( m ), Fraction.fromInteger( n ),
        debugDerivation );
    }
  } );
} );