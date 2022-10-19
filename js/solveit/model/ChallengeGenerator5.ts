// Copyright 2018-2022, University of Colorado Boulder

/**
 * Challenge generator for game level 5.
 * See specification in https://docs.google.com/document/d/1vG5U9HhcqVGMvmGGXry28PLqlNWj25lStDP2vSWgUOo/edit.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import equalityExplorer from '../../equalityExplorer.js';
import Challenge from './Challenge.js';
import ChallengeGenerator from './ChallengeGenerator.js';

// strings (debug)
const PATTERN = 'ax + b = mx + n<br>' +
                'x = {{x}}<br>' +
                'a = {{a}}<br>' +
                'b = {{b}}<br>' +
                'm = {{m}}<br>' +
                'n = (a–m)x + b = {{n}}';

// constants
const X_VALUES = ChallengeGenerator.rangeToArray( -40, 40 );
const A_VALUES = ChallengeGenerator.rangeToArray( -10, 10 );
const B_VALUES = ChallengeGenerator.rangeToArray( -10, 10 );
const M_VALUES = ChallengeGenerator.rangeToArray( -10, 10 );

export default class ChallengeGenerator5 extends ChallengeGenerator {

  public constructor() {
    super();
  }

  /**
   * Generates the next challenge.
   *
   * Form: ax + b = mx + n
   * Let x be a random integer between [-40,40], x !== 0
   * Let a be a random integer between [-10,10], a !== 0
   * Let b be a random integer between [-10,10], b !== 0
   * Let m be a random integer between [-10,10], m !== 0, m !== a, |a-m| <= 10
   * Let n = (a – m)x + b, n == 0 is OK
   */
  protected override nextChallengeProtected(): Challenge {

    const x = this.randomX( X_VALUES );
    const a = ChallengeGenerator.randomValue( A_VALUES, [ 0 ] );
    const b = ChallengeGenerator.randomValue( B_VALUES, [ 0 ] );
    const m = ChallengeGenerator.randomValueBy( M_VALUES,
      m => ( m !== 0 ) && ( m !== a ) && ( Math.abs( a - m ) <= 10 )
    );
    const n = ( ( a - m ) * x ) + b;

    // Verify that computations meeting design requirements.
    assert && assert( x !== 0, 'x is 0' );
    assert && assert( a !== 0, 'a is 0' );
    assert && assert( b !== 0, 'b is 0' );
    assert && assert( m !== 0, 'm is 0' );
    assert && assert( m !== a, `m === a: ${m}` );
    assert && assert( Math.abs( a - m ) <= 10, `|a-m| is too large: ${Math.abs( a - m )}` );

    // derivation that corresponds to design doc, displayed with 'showAnswers' query parameter
    const debugDerivation = StringUtils.fillIn( PATTERN, { x: x, a: a, b: b, m: m, n: n } );

    // ax + b = mx + n
    return new Challenge( x,
      Fraction.fromInteger( a ), Fraction.fromInteger( b ),
      Fraction.fromInteger( m ), Fraction.fromInteger( n ),
      debugDerivation );
  }
}

equalityExplorer.register( 'ChallengeGenerator5', ChallengeGenerator5 );