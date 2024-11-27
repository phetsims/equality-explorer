// Copyright 2018-2022, University of Colorado Boulder

/**
 * Challenge generator for game level 2.
 * See specification in https://docs.google.com/document/d/1vG5U9HhcqVGMvmGGXry28PLqlNWj25lStDP2vSWgUOo/edit.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import dotRandom from '../../../../dot/js/dotRandom.js';
import equalityExplorer from '../../equalityExplorer.js';
import Challenge from './Challenge.js';
import ChallengeGenerator from './ChallengeGenerator.js';
import ChallengeGenerator1 from './ChallengeGenerator1.js';

export default class ChallengeGenerator2 extends ChallengeGenerator {

  // ChallengeGenerator2 is a variation and subset of ChallengeGenerator1, so we'll use composition
  private readonly challengeGenerator1: ChallengeGenerator1;

  // methods for generating the 2 types of challenges
  private readonly challengeTypeMethods: ( () => Challenge )[];

  public constructor() {
    super();

    this.challengeGenerator1 = new ChallengeGenerator1( {
      aValues: ChallengeGenerator.rangeToArray( -10, -1 ),
      dValues: ChallengeGenerator.rangeToArray( -10, -1 )
    } );

    this.challengeTypeMethods = [
      () => this.nextType1(),
      () => this.nextType3()
    ];
  }

  /**
   * Generates the next challenge.
   */
  protected override nextChallengeProtected(): Challenge {

    if ( this.numberOfChallenges === 0 ) {

      // First challenge should be type 1, with a=-1.
      return this.nextType1( -1 );
    }
    else {

      // Randomly select the challenge type.
      return dotRandom.sample( this.challengeTypeMethods )();
    }
  }

  /**
   * Generates the next 'type 1' challenge. Delegates to ChallengeGenerator1.
   * @param [a] - if you'd like to use a specific value of a, otherwise randomly selected
   */
  public nextType1( a?: number ): Challenge {
    return this.challengeGenerator1.nextType1( a );
  }

  /**
   * Generates the next 'type 3' challenge. Delegates to ChallengeGenerator1.
   */
  private nextType3(): Challenge {
    return this.challengeGenerator1.nextType3();
  }
}

equalityExplorer.register( 'ChallengeGenerator2', ChallengeGenerator2 );