// Copyright 2018, University of Colorado Boulder

/**
 * Challenge generator for game level 2.
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
  const PATTERN = 'level 2, ax + b = c<br>' +
                'x = {{x}}<br>' +
                'a = {{a}}<br>' +
                'b = {{b}}<br>' +
                'c = ax + b = {{c}}';

  // constants
  const X_VALUES = ChallengeGenerator.rangeToArray( -40, 40 );
  const A_VALUES = ChallengeGenerator.rangeToArray( -10, 10 );
  const B_VALUES = ChallengeGenerator.rangeToArray( -10, 10 );

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

      const x = this.randomX( X_VALUES );
      const a = ChallengeGenerator.randomValue( A_VALUES, [ 0 ] );
      const b = ChallengeGenerator.randomValue( B_VALUES, [ 0 ] );
      const c = ( a * x ) + b;

      // Verify that computations meeting design requirements.
      assert && assert( x !== 0, 'x is 0' );
      assert && assert( a !== 0, 'a is 0' );
      assert && assert( b !== 0, 'b is 0' );

      // derivation that corresponds to design doc, displayed with 'showAnswers' query parameter
      const debugDerivation = StringUtils.fillIn( PATTERN, { x: x, a: a, b: b, c: c } );

      // ax + b = 0x + c
      return new Challenge( x,
        Fraction.fromInteger( a ), Fraction.fromInteger( b ),
        Fraction.fromInteger( 0 ), Fraction.fromInteger( c ),
        debugDerivation );
    }
  } );
} );