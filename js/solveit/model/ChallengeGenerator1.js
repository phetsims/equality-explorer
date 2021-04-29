// Copyright 2018-2020, University of Colorado Boulder

/**
 * Challenge generator for game level 1.
 * See specification in https://docs.google.com/document/d/1vG5U9HhcqVGMvmGGXry28PLqlNWj25lStDP2vSWgUOo/edit.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import dotRandom from '../../../../dot/js/dotRandom.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import EqualityExplorerQueryParameters from '../../common/EqualityExplorerQueryParameters.js';
import equalityExplorer from '../../equalityExplorer.js';
import equalityExplorerStrings from '../../equalityExplorerStrings.js';
import Challenge from './Challenge.js';
import ChallengeGenerator from './ChallengeGenerator.js';

// strings (debug)
const PATTERN1 = 'level 1, type 1, ax = c<br>' +
                 'x = {{x}}<br>' +
                 'a = {{a}}<br>' +
                 'c = a * x = {{c}}';
const PATTERN2 = 'level 1, type 2, x + b = c<br>' +
                 'x = {{x}}<br>' +
                 'b = {{b}}<br>' +
                 'c = x + b = {{c}}';
const PATTERN3 = 'level 1, type 3, x/d = c<br>' +
                 'c = {{c}}<br>' +
                 'd = {{d}}<br>' +
                 'x = c * d = {{x}} ';

// constants
const X_VALUES = ChallengeGenerator.rangeToArray( -40, 40 );
const A_VALUES = EqualityExplorerQueryParameters.easyLevel1 ?
                 ChallengeGenerator.rangeToArray( 2, 10 ) :
                 ChallengeGenerator.rangeToArray( -10, 10 );
const B_VALUES = ChallengeGenerator.rangeToArray( -10, 10 );
const C_VALUES = ChallengeGenerator.rangeToArray( -10, 10 );
const D_VALUES = EqualityExplorerQueryParameters.easyLevel1 ?
                 ChallengeGenerator.rangeToArray( 2, 10 ) :
                 ChallengeGenerator.rangeToArray( -10, 10 );
const MAX_ATTEMPTS = 50; // max attempts in a while loop

class ChallengeGenerator1 extends ChallengeGenerator {

  constructor() {
    super( 1, equalityExplorerStrings.level1Description );

    // @private methods for generating the 3 types of challenges
    this.challengeTypeMethods = [
      this.nextType1.bind( this ),
      this.nextType2.bind( this ),
      this.nextType3.bind( this )
    ];
  }

  /**
   * Generates the next challenge.
   * @returns {Challenge}
   * @protected
   * @override
   */
  nextChallengeProtected() {
    if ( this.numberOfChallenges < 3 ) {

      // For the first 3 challenges, generate 1 of each type, in order.
      return this.challengeTypeMethods[ this.numberOfChallenges ]();
    }
    else {

      // After the first 3 challenges, randomly select the challenge type.
      return dotRandom.sample( this.challengeTypeMethods )();
    }
  }

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
  nextType1() {

    const x = this.randomX( X_VALUES );
    const a = ChallengeGenerator.randomValue( A_VALUES, [ 0, 1 ] );
    const c = a * x;

    // Verify that computations meeting design requirements.
    assert && assert( x !== 0, 'x is 0' );
    assert && assert( a !== 0, 'a is 0' );
    assert && assert( c !== 0, 'c is 0' );

    // derivation that corresponds to design doc, displayed with 'showAnswers' query parameter
    const debugDerivation = StringUtils.fillIn( PATTERN1, { x: x, a: a, c: c } );

    // ax + 0 = 0x + c
    return new Challenge( x,
      Fraction.fromInteger( a ), Fraction.fromInteger( 0 ),
      Fraction.fromInteger( 0 ), Fraction.fromInteger( c ),
      debugDerivation );
  }

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
  nextType2() {

    const x = this.randomX( X_VALUES );
    const b = ChallengeGenerator.randomValue( B_VALUES, [ 0 ] );
    const c = x + b;

    // Verify that computations meeting design requirements.
    assert && assert( x !== 0, 'x is 0' );
    assert && assert( b !== 0, 'b is 0' );

    // derivation that corresponds to design doc, displayed with 'showAnswers' query parameter
    const debugDerivation = StringUtils.fillIn( PATTERN2, { x: x, b: b, c: c } );

    // 1x + b = 0x + c
    return new Challenge( x,
      Fraction.fromInteger( 1 ), Fraction.fromInteger( b ),
      Fraction.fromInteger( 0 ), Fraction.fromInteger( c ),
      debugDerivation );
  }

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
  nextType3() {

    let x = this.xPrevious;
    let c;
    let d;
    let attempts = 0; // to prevent an improbable infinite while loop
    while ( x === this.xPrevious && attempts < MAX_ATTEMPTS ) {
      attempts++;
      c = ChallengeGenerator.randomValue( C_VALUES, [ 0 ] );
      d = ChallengeGenerator.randomValue( D_VALUES, [ 0, 1 ] );
      x = c * d;
    }

    // Verify that computations meeting design requirements.
    assert && assert( c !== 0, 'c is 0' );
    assert && assert( d !== 0, 'd is 0' );
    assert && assert( d !== 1, 'd is 1' );
    assert && assert( x !== 0, 'x is 0' );
    assert && assert( x !== this.xPrevious || attempts === MAX_ATTEMPTS, `x === xPrevious: ${x}` );
    this.xPrevious = x;

    // derivation that corresponds to design doc, displayed with 'showAnswers' query parameter
    const debugDerivation = StringUtils.fillIn( PATTERN3, { x: x, c: c, d: d } );

    // (1/d)x + 0 = 0x + c
    return new Challenge( x,
      new Fraction( 1, d ), Fraction.fromInteger( 0 ),
      Fraction.fromInteger( 0 ), Fraction.fromInteger( c ),
      debugDerivation );
  }
}

equalityExplorer.register( 'ChallengeGenerator1', ChallengeGenerator1 );

export default ChallengeGenerator1;