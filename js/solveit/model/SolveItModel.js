// Copyright 2018-2021, University of Colorado Boulder

/**
 * Model for the 'Solve It!' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import equalityExplorer from '../../equalityExplorer.js';
import ChallengeGenerator1 from './ChallengeGenerator1.js';
import ChallengeGenerator2 from './ChallengeGenerator2.js';
import ChallengeGenerator3 from './ChallengeGenerator3.js';
import ChallengeGenerator4 from './ChallengeGenerator4.js';
import ChallengeGenerator5 from './ChallengeGenerator5.js';
import SolveItScene from './SolveItScene.js';

class SolveItModel {

  constructor() {

    // @private challenge generators
    this.challengeGenerators = [
      new ChallengeGenerator1(),
      new ChallengeGenerator2(),
      new ChallengeGenerator3(),
      new ChallengeGenerator4(),
      new ChallengeGenerator5()
    ];
    assert && assert( this.challengeGenerators.length === _.uniqBy( _.map( this.challengeGenerators, challengeGenerator => challengeGenerator.level ) ).length,
      'Challenge generators must have unique level numbers.' );
    assert && assert( _.every( this.challengeGenerators, ( value, index, array ) => ( index === 0 || array[ index - 1 ].level <= value.level ) ),
      'Challenge generators must be ordered by ascending level number.' );

    // @public (read-only) {SolveItScene[]} a scene for each challenge generator
    this.scenes = _.map( this.challengeGenerators, challengeGenerator => new SolveItScene( challengeGenerator ) );

    // @public {SolveItScene|null} the selected scene, null if no scene is currently selected
    this.sceneProperty = new Property( null );
  }

  // @public
  reset() {
    this.challengeGenerators.forEach( challengeGenerator => challengeGenerator.reset() );
    this.scenes.forEach( scene => scene.reset() );
    this.sceneProperty.reset();
  }

  // @public
  step( dt ) {}

  /**
   * Tests challenge generators by generating a large number of challenges.
   * Each challenge is printed to the browser console.
   * @public (debug)
   */
  testChallengeGenerators() {

    const testsPerLevel = 1000;

    for ( let i = 0; i < this.challengeGenerators.length; i++ ) {

      console.log( `>>> Testing level ${i + 1}` );
      const challengeGenerator = this.challengeGenerators[ i ];

      for ( let j = 0; j < testsPerLevel; j++ ) {
        const challenge = challengeGenerator.nextChallenge();
        console.log( `${j}: ${challenge.toString()}` );
      }
    }

    console.log( '>>> Tests passed for all levels' );
  }
}

equalityExplorer.register( 'SolveItModel', SolveItModel );

export default SolveItModel;