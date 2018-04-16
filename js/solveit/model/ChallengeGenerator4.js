// Copyright 2018, University of Colorado Boulder

/**
 * Challenge generator for game level 4.
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
  var M_RANGE = new Range( -10, 10 );

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
     * Let m be a random integer between [-10,10], m !== 0, m !== a
     * Let n = (a – m)x + b
     *
     * @returns {Challenge}
     * @protected
     * @override
     */
    nextChallengeProtected: function() {

      var x = this.nextXInRange( X_RANGE );
      var a = this.nextIntInRange( A_RANGE );
      var b = this.nextIntInRange( B_RANGE );
      var m = a;
      while ( m === a ) {
        m = this.nextIntInRange( M_RANGE );
      }
      var n = ( ( a - m ) * x ) + b;

      // derivation that corresponds to design doc
      var debugDescription =
        'ChallengeGenerator4, ax + b = mx + n, ' +
        StringUtils.fillIn( 'x={{x}} a={{a}} b={{b}} m={{m}} n=(a–m)x+b={{n}}', {
          x: x,
          a: a,
          b: b,
          m: m,
          n: n
        } );

      // ax + b = mx + n
      return new Challenge( x,
        Fraction.fromInteger( a ), Fraction.fromInteger( b ),
        Fraction.fromInteger( m ), Fraction.fromInteger( n ),
        debugDescription );
    }
  } );
} );