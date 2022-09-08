// Copyright 2018-2022, University of Colorado Boulder

/**
 * Challenge generator for game level 1.
 * See specification in https://docs.google.com/document/d/1vG5U9HhcqVGMvmGGXry28PLqlNWj25lStDP2vSWgUOo/edit.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import dotRandom from '../../../../dot/js/dotRandom.js';
import merge from '../../../../phet-core/js/merge.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerStrings from '../../EqualityExplorerStrings.js';
import Challenge from './Challenge.js';
import ChallengeGenerator from './ChallengeGenerator.js';

// strings (debug)
const PATTERN1 = 'level {{level}}, type 1, ax = c<br>' +
                 'x = {{x}}<br>' +
                 'a = {{a}}<br>' +
                 'c = a * x = {{c}}';
const PATTERN2 = 'level {{level}}, type 2, x + b = c<br>' +
                 'x = {{x}}<br>' +
                 'b = {{b}}<br>' +
                 'c = x + b = {{c}}';
const PATTERN3 = 'level {{level}}, type 3, x/d = c<br>' +
                 'c = {{c}}<br>' +
                 'd = {{d}}<br>' +
                 'x = c * d = {{x}} ';

// constants
const MAX_ATTEMPTS = 50; // max attempts in a while loop

class ChallengeGenerator1 extends ChallengeGenerator {

  constructor( options ) {

    options = merge( {

      // These sets of values are different for Level 2
      aValues: ChallengeGenerator.rangeToArray( 2, 10 ),
      dValues: ChallengeGenerator.rangeToArray( 2, 10 ),

      // {number|null} The level number to appear in debugging output, defaults to this.level.
      // This is used Level 2 delegates to Level 1, so that debugging output identifies the challenge as Level 2.
      debugLevel: null
    }, options );

    super( 1, EqualityExplorerStrings.level1Description );

    // @private
    this.debugLevel = options.debugLevel || this.level;

    // @private
    this.xValues = ChallengeGenerator.rangeToArray( -40, 40 );
    this.aValues = options.aValues;
    this.bValues = ChallengeGenerator.rangeToArray( -10, 10 );
    this.cValues = ChallengeGenerator.rangeToArray( -10, 10 );
    this.dValues = options.dValues;

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
   * @param {number} [a] - if you'd like to use a specific value of a, otherwise randomly selected
   * @returns {Challenge}
   * @protected
   */
  nextType1( a ) {

    const x = this.randomX( this.xValues );
    a = ( a !== undefined ) ? a : ChallengeGenerator.randomValue( this.aValues, [ 0, 1 ] );
    const c = a * x;

    // Verify that computations meeting design requirements.
    assert && assert( x !== 0, 'x is 0' );
    assert && assert( a !== 0, 'a is 0' );
    assert && assert( c !== 0, 'c is 0' );

    // derivation that corresponds to design doc, displayed with 'showAnswers' query parameter
    const debugDerivation = StringUtils.fillIn( PATTERN1, { level: this.debugLevel, x: x, a: a, c: c } );

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

    const x = this.randomX( this.xValues );
    const b = ChallengeGenerator.randomValue( this.bValues, [ 0 ] );
    const c = x + b;

    // Verify that computations meeting design requirements.
    assert && assert( x !== 0, 'x is 0' );
    assert && assert( b !== 0, 'b is 0' );

    // derivation that corresponds to design doc, displayed with 'showAnswers' query parameter
    const debugDerivation = StringUtils.fillIn( PATTERN2, { level: this.debugLevel, x: x, b: b, c: c } );

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
      c = ChallengeGenerator.randomValue( this.cValues, [ 0 ] );
      d = ( d !== undefined ) ? d : ChallengeGenerator.randomValue( this.dValues, [ 0, 1 ] );
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
    const debugDerivation = StringUtils.fillIn( PATTERN3, { level: this.debugLevel, x: x, c: c, d: d } );

    // (1/d)x + 0 = 0x + c
    return new Challenge( x,
      new Fraction( 1, d ), Fraction.fromInteger( 0 ),
      Fraction.fromInteger( 0 ), Fraction.fromInteger( c ),
      debugDerivation );
  }
}

equalityExplorer.register( 'ChallengeGenerator1', ChallengeGenerator1 );

export default ChallengeGenerator1;