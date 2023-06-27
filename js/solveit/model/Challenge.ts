// Copyright 2018-2022, University of Colorado Boulder

/**
 * A challenge, in the form of an equation involving 1 variable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import equalityExplorer from '../../equalityExplorer.js';
import { StateObject } from '../../../../tandem/js/types/StateSchema.js';

const stateSchema = {
  x: NumberIO,
  a: Fraction.FractionIO,
  b: Fraction.FractionIO,
  m: Fraction.FractionIO,
  n: Fraction.FractionIO,
  debugDerivation: StringIO
} as const;

export type ChallengeStateObject = StateObject<typeof stateSchema>;

export default class Challenge {

  /**
   * Form: ax + b = mx + n
   * These letters correspond to the design specification, see
   * https://docs.google.com/document/d/1vG5U9HhcqVGMvmGGXry28PLqlNWj25lStDP2vSWgUOo
   *
   * @param x - value of the variable x
   * @param a - coefficient on the left side of the equation
   * @param b - constant on the left side of the equation
   * @param m - coefficient on the right side of the equation
   * @param n - constant on the right side of the equation
   * @param debugDerivation - derivation details provided by ChallengeGenerator, contains RichText markup.
   *    With the 'showAnswers' query parameter, this information is displayed in the sim.
   *    This information is provided by ChallengeGenerator subclasses, contains RichText markup,
   *    and corresponds to the challenge specification in the design document, see
   *    https://docs.google.com/document/d/1vG5U9HhcqVGMvmGGXry28PLqlNWj25lStDP2vSWgUOo
   *    DO NOT RELY ON THE FORMAT OF THIS FIELD!
   */
  public constructor( public readonly x: number,
                      public readonly a: Fraction,
                      public readonly b: Fraction,
                      public readonly m: Fraction,
                      public readonly n: Fraction,
                      public readonly debugDerivation: string ) {

    assert && assert( Number.isInteger( x ), `invalid x: ${x}` );
    assert && assert( a.timesInteger( x ).plus( b ).reduce().equals( m.timesInteger( x ).plus( n ).reduce() ),
      `challenge must be an equality: ${this}` );
  }

  // For debugging. Do not rely on this format!
  public toString(): string {
    return StringUtils.fillIn( '{{a}} x + {{b}} = {{m}} x + {{n}} (x={{x}})', {
      a: fractionToString( this.a ),
      b: fractionToString( this.b ),
      m: fractionToString( this.m ),
      n: fractionToString( this.n ),
      x: this.x
    } );
  }

  /**
   * PhET-iO deserialization
   */
  public static fromStateObject( stateObject: ChallengeStateObject ): Challenge {
    return new Challenge(
      stateObject.x,
      Fraction.FractionIO.fromStateObject( stateObject.a ),
      Fraction.FractionIO.fromStateObject( stateObject.b ),
      Fraction.FractionIO.fromStateObject( stateObject.m ),
      Fraction.FractionIO.fromStateObject( stateObject.n ),
      stateObject.debugDerivation
    );
  }

  public static readonly ChallengeIO = new IOType<Challenge, ChallengeStateObject>( 'ChallengeIO', {
    valueType: Challenge,
    stateSchema: stateSchema,
    fromStateObject: stateObject => Challenge.fromStateObject( stateObject )
  } );
}

/**
 * Converts a Fraction to a string representation. This is done here because Fraction.toString is in common code,
 * and doesn't provide the format that we want for our debugging output.
 */
function fractionToString( f: Fraction ): string {
  return ( f.isInteger() ? `${f.getValue()}` : `${f.numerator}/${f.denominator}` );
}

equalityExplorer.register( 'Challenge', Challenge );