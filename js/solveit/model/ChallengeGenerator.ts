// Copyright 2018-2022, University of Colorado Boulder

/**
 * Abstract base class for challenge generators.
 * See specification in https://docs.google.com/document/d/1vG5U9HhcqVGMvmGGXry28PLqlNWj25lStDP2vSWgUOo/edit.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import LinkableProperty from '../../../../axon/js/LinkableProperty.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import EqualityExplorerConstants from '../../common/EqualityExplorerConstants.js';
import equalityExplorer from '../../equalityExplorer.js';
import Challenge from './Challenge.js';

export default abstract class ChallengeGenerator {

  // unique integer level number
  public readonly level: number;

  // description that appear in the UI for the level
  public readonly descriptionProperty: LinkableProperty<string>;

  // number of challenges generated
  public numberOfChallenges: number;

  // Value of x for the previous challenge, so we don't use the same value for consecutive challenges.
  // The design document says "It’s OK to generate the same coefficient or constant for consecutive challenges.
  // Do not generate the exact same challenge (coefficient, constant, AND value for x) twice in a row." So we
  // only need to pick one quantity that is not the same, and we have chosen 'x', since it's common to all
  // challenges.
  protected xPrevious: number;

  protected constructor( level: number, descriptionProperty: LinkableProperty<string> ) {
    assert && assert( Number.isInteger( level ) && level > 0 );
    assert && assert( level > 0 && level <= EqualityExplorerConstants.NUMBER_OF_GAME_LEVELS );

    this.level = level;
    this.descriptionProperty = descriptionProperty;
    this.numberOfChallenges = 0;
    this.xPrevious = 0;
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }

  public reset(): void {
    this.numberOfChallenges = 0;
  }

  /**
   * Generates the next challenge for this level.
   */
  public nextChallenge(): Challenge {
    const challenge = this.nextChallengeProtected();
    this.numberOfChallenges++;
    return challenge;
  }

  /**
   * Subtype-specific method of generating the next challenge for this level.
   */
  protected abstract nextChallengeProtected(): Challenge;

  /**
   * Randomly samples a value for x from a set of values, excluding zero and the previous value of x.
   */
  public randomX( values: number[] ): number {
    const x = ChallengeGenerator.randomValue( values, [ 0, this.xPrevious ] );
    assert && assert( x !== 0, 'x is 0' );
    assert && assert( x !== this.xPrevious, `x === xPrevious: ${x}` );
    this.xPrevious = x;
    return x;
  }

  /**
   * Converts an integer range to an array of integer values.
   */
  public static rangeToArray( min: number, max: number ): number[] {

    assert && assert( Number.isInteger( min ), `min must be an integer: ${min}` );
    assert && assert( Number.isInteger( max ), `max must be an integer: ${max}` );

    const values = []; // {number[]}
    for ( let i = min; i <= max; i++ ) {
      values.push( i );
    }
    return values;
  }

  /**
   * Randomly samples a value from a set of values, after filtering out values that don't meet some predicate.
   */
  public static randomValueBy( values: number[], predicate: ( value: number ) => boolean ): number {
    const filteredValues = _.filter( values, predicate );
    assert && assert( filteredValues.length > 0, 'all values were excluded' );
    return dotRandom.sample( filteredValues );
  }

  /**
   * Randomly samples a value from a set of values, after excluding an optional set of values.
   */
  public static randomValue( values: number[], excludedValues?: number[] ): number {
    return ChallengeGenerator.randomValueBy( values, value => !_.includes( excludedValues, value ) );
  }
}

equalityExplorer.register( 'ChallengeGenerator', ChallengeGenerator );