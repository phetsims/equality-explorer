// Copyright 2018-2022, University of Colorado Boulder

/**
 * Challenge generator for game level 2.
 * See specification in https://docs.google.com/document/d/1vG5U9HhcqVGMvmGGXry28PLqlNWj25lStDP2vSWgUOo/edit.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import dotRandom from '../../../../dot/js/dotRandom.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerStrings from '../../EqualityExplorerStrings.js';
import ChallengeGenerator from './ChallengeGenerator.js';
import ChallengeGenerator1 from './ChallengeGenerator1.js';

class ChallengeGenerator2 extends ChallengeGenerator {

  constructor() {
    super( 2, EqualityExplorerStrings.level2Description );

    // @private ChallengeGenerator2 is a variation and subset of ChallengeGenerator1, so we'll use composition
    this.challengeGenerator1 = new ChallengeGenerator1( {
      aValues: ChallengeGenerator.rangeToArray( -10, -1 ),
      dValues: ChallengeGenerator.rangeToArray( -10, -1 ),
      debugLevel: this.level
    } );

    // @private methods for generating the 2 types of challenges
    this.challengeTypeMethods = [
      this.nextType1.bind( this ),
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
   * @param {number} [a] - if you'd like to use a specific value of a, otherwise randomly selected
   * @returns {Challenge}
   * @private
   */
  nextType1( a ) {
    return this.challengeGenerator1.nextType1( a );
  }

  /**
   * Generates the next 'type 3' challenge. Delegates to ChallengeGenerator1.
   * @returns {Challenge}
   * @private
   */
  nextType3() {
    return this.challengeGenerator1.nextType3();
  }
}

equalityExplorer.register( 'ChallengeGenerator2', ChallengeGenerator2 );

export default ChallengeGenerator2;