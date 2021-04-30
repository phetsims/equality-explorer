// Copyright 2018-2020, University of Colorado Boulder

/**
 * Challenge generator for game level 4.
 * See specification in https://docs.google.com/document/d/1vG5U9HhcqVGMvmGGXry28PLqlNWj25lStDP2vSWgUOo/edit.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import dotRandom from '../../../../dot/js/dotRandom.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import equalityExplorer from '../../equalityExplorer.js';
import equalityExplorerStrings from '../../equalityExplorerStrings.js';
import Challenge from './Challenge.js';
import ChallengeGenerator from './ChallengeGenerator.js';

// strings (debug)
const PATTERN1 = 'level {{level}}, type 1, (a/d)x + b = c<br>' +
                 'x = {{x}}<br>' +
                 'd = {{d}}<br>' +
                 'a = {{a}}<br>' +
                 'b = {{b}}<br>' +
                 'c = (a/d)x + b = {{c}}';
const PATTERN2 = 'level {{level}}, type 2, (a/d)x + b/d = c<br>' +
                 'x = {{x}}<br>' +
                 'd = {{d}}<br>' +
                 'a = {{a}}<br>' +
                 'b = {{b}}<br>' +
                 'c = (ax + b)/d = {{c}}';

// constants
const X_VALUES = ChallengeGenerator.rangeToArray( -40, 40 );
const A_VALUES = ChallengeGenerator.rangeToArray( -10, 10 );
const B_VALUES_TYPE1 = ChallengeGenerator.rangeToArray( -3, 3 );
const B_VALUES_TYPE2 = ChallengeGenerator.rangeToArray( -10, 10 );
const D_VALUES = ChallengeGenerator.rangeToArray( -10, 10 );

class ChallengeGenerator4 extends ChallengeGenerator {

  constructor() {
    super( 4, equalityExplorerStrings.level4Description );

    // @private methods for generating the 2 types of challenges
    this.challengeTypeMethods = [ this.nextType1.bind( this ), this.nextType2.bind( this ) ];
  }

  /**
   * Generates the next challenge.
   * @returns {Challenge}
   * @protected
   * @override
   */
  nextChallengeProtected() {

    // Randomly select the type of challenge to generate.
    return dotRandom.sample( this.challengeTypeMethods )();
  }

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
  nextType1() {

    const x = this.randomX( X_VALUES );
    const d = ChallengeGenerator.randomValue( D_VALUES, [ 0, 1, -1 ] );
    const a = ChallengeGenerator.randomValueBy( A_VALUES, a => ( a % d !== 0 ) );
    const b = ChallengeGenerator.randomValue( B_VALUES_TYPE1, [ 0 ] );
    const c = new Fraction( a, d ).timesInteger( x ).plusInteger( b ).reduce();

    // Verify that computations meeting design requirements.
    assert && assert( x !== 0, 'x is 0' );
    assert && assert( d !== 0, 'd is 0' );
    assert && assert( a % d !== 0, `a/d reduces to an integer, a=${a}, d=${d}` );
    assert && assert( b !== 0, 'b is 0' );

    // Verify that we fixed the 'too many steps to solve' problem.
    // see https://github.com/phetsims/equality-explorer/issues/38#issuecomment-384761619
    const bd = b * d;
    assert && assert( bd >= -30 && bd <= 30, `(b * d) out of range: ${bd}` );

    // derivation that corresponds to design doc, displayed with 'showAnswers' query parameter
    const debugDerivation = StringUtils.fillIn( PATTERN1, { level: this.level, x: x, a: a, b: b, c: c, d: d } );

    // (a/d)x + b = 0x + c
    return new Challenge( x,
      new Fraction( a, d ).reduce(), Fraction.fromInteger( b ),
      Fraction.fromInteger( 0 ), c,
      debugDerivation );
  }

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
  nextType2() {

    const x = this.randomX( X_VALUES );
    const d = ChallengeGenerator.randomValue( D_VALUES, [ 0, 1, -1 ] );
    const a = ChallengeGenerator.randomValueBy( A_VALUES, a => ( a % d !== 0 ) );
    const b = ChallengeGenerator.randomValueBy( B_VALUES_TYPE2, b => ( b % d !== 0 ) );
    const c = new Fraction( ( a * x ) + b, d ).reduce();

    // Verify that computations meeting design requirements.
    assert && assert( x !== 0, 'x is 0' );
    assert && assert( d !== 0, 'd is 0' );
    assert && assert( a % d !== 0, `a/d reduces to an integer, a=${a}, d=${d}` );
    assert && assert( b % d !== 0, `b/d reduces to an integer, b=${b}, d=${d}` );

    // derivation that corresponds to design doc, displayed with 'showAnswers' query parameter
    const debugDerivation = StringUtils.fillIn( PATTERN2, { level: this.level, x: x, a: a, b: b, c: c, d: d } );

    // (a/d)x + (b/d) = 0x + c
    return new Challenge( x,
      new Fraction( a, d ).reduce(), new Fraction( b, d ).reduce(),
      Fraction.fromInteger( 0 ), c,
      debugDerivation );
  }
}

equalityExplorer.register( 'ChallengeGenerator4', ChallengeGenerator4 );

export default ChallengeGenerator4;