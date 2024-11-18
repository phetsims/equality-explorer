// Copyright 2018-2022, University of Colorado Boulder

/**
 * Challenge generator for game level 1.
 * See specification in https://docs.google.com/document/d/1vG5U9HhcqVGMvmGGXry28PLqlNWj25lStDP2vSWgUOo/edit.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import dotRandom from '../../../../dot/js/dotRandom.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import equalityExplorer from '../../equalityExplorer.js';
import Challenge from './Challenge.js';
import ChallengeGenerator from './ChallengeGenerator.js';

// strings (debug)
const PATTERN1 = 'Type 1: ax = c<br>' +
                 'x = {{x}}<br>' +
                 'a = {{a}}<br>' +
                 'c = {{c}}';
const PATTERN2 = 'Type 2: x + b = c<br>' +
                 'x = {{x}}<br>' +
                 'b = {{b}}<br>' +
                 'c = {{c}}';
const PATTERN3 = 'Type 3: x/d = c<br>' +
                 'c = {{c}}<br>' +
                 'd = {{d}}<br>' +
                 'x = {{x}}';

// constants
const MAX_ATTEMPTS = 50; // max attempts in a while loop

type SelfOptions = {

  // These sets of values are different for Level 2, so are provided as options.
  aValues?: number[];
  dValues?: number[];
};

type ChallengeGenerator1Options = SelfOptions;

export default class ChallengeGenerator1 extends ChallengeGenerator {

  private readonly xValues: number[];
  private readonly aValues: number[];
  private readonly bValues: number[];
  private readonly cValues: number[];
  private readonly dValues: number[];

  // methods for generating the 3 types of challenges
  private readonly challengeTypeMethods: ( () => Challenge )[];

  public constructor( providedOptions?: ChallengeGenerator1Options ) {

    const options = optionize<ChallengeGenerator1Options, SelfOptions>()( {

      // SelfOptions
      aValues: ChallengeGenerator.rangeToArray( 2, 10 ),
      dValues: ChallengeGenerator.rangeToArray( 2, 10 )
    }, providedOptions );

    super();

    this.xValues = ChallengeGenerator.rangeToArray( -40, 40 );
    this.aValues = options.aValues;
    this.bValues = ChallengeGenerator.rangeToArray( -10, 10 );
    this.cValues = ChallengeGenerator.rangeToArray( -10, 10 );
    this.dValues = options.dValues;

    this.challengeTypeMethods = [
      () => this.nextType1(),
      () => this.nextType2(),
      () => this.nextType3()
    ];
  }

  /**
   * Generates the next challenge.
   */
  protected override nextChallengeProtected(): Challenge {
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
   * @param [a] - if you'd like to use a specific value of a, otherwise randomly selected
   */
  public nextType1( a?: number ): Challenge {

    const x = this.randomX( this.xValues );
    a = ( a !== undefined ) ? a : ChallengeGenerator.randomValue( this.aValues, [ 0, 1 ] );
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
   */
  protected nextType2(): Challenge {

    const x = this.randomX( this.xValues );
    const b = ChallengeGenerator.randomValue( this.bValues, [ 0 ] );
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
   */
  public nextType3(): Challenge {

    let x = this.xPrevious;
    let c = 0;
    let d = 0;
    let attempts = 0; // to prevent an improbable infinite while loop
    while ( x === this.xPrevious && attempts < MAX_ATTEMPTS ) {
      attempts++;
      c = ChallengeGenerator.randomValue( this.cValues, [ 0 ] );
      d = ChallengeGenerator.randomValue( this.dValues, [ 0, 1 ] );
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