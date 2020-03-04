// Copyright 2018-2020, University of Colorado Boulder

/**
 * Model for the 'Solve It!' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import inherit from '../../../../phet-core/js/inherit.js';
import equalityExplorerStrings from '../../equality-explorer-strings.js';
import equalityExplorer from '../../equalityExplorer.js';
import ChallengeGenerator1 from './ChallengeGenerator1.js';
import ChallengeGenerator2 from './ChallengeGenerator2.js';
import ChallengeGenerator3 from './ChallengeGenerator3.js';
import ChallengeGenerator4 from './ChallengeGenerator4.js';
import SolveItScene from './SolveItScene.js';

const level1String = equalityExplorerStrings.level1;
const level2String = equalityExplorerStrings.level2;
const level3String = equalityExplorerStrings.level3;
const level4String = equalityExplorerStrings.level4;

/**
 * @constructor
 */
function SolveItModel() {

  // @public (read-only) descriptions for each game level, ordered by ascending level number
  this.levelDescriptions = [
    level1String,
    level2String,
    level3String,
    level4String
  ];

  // @private challenge generators, ordered by ascending level number
  this.challengeGenerators = [
    new ChallengeGenerator1(),
    new ChallengeGenerator2(),
    new ChallengeGenerator3(),
    new ChallengeGenerator4()
  ];
  assert && assert( this.challengeGenerators.length === this.levelDescriptions.length,
    'levelDescriptions and challengeGenerators must have the same number of elements' );

  // @public (read-only) {SolveItScene[]} a scene for each level
  this.scenes = [];
  for ( let i = 0; i < this.levelDescriptions.length; i++ ) {
    this.scenes.push( new SolveItScene( i + 1, this.levelDescriptions[ i ], this.challengeGenerators[ i ] ) );
  }

  // @public {SolveItScene|null} the selected scene, null if no scene is currently selected
  this.sceneProperty = new Property( null );
}

equalityExplorer.register( 'SolveItModel', SolveItModel );

export default inherit( Object, SolveItModel, {

  // @public
  reset: function() {
    this.challengeGenerators.forEach( challengeGenerator => challengeGenerator.reset() );
    this.scenes.forEach( scene => scene.reset() );
    this.sceneProperty.reset();
  },

  /**
   * Tests challenge generators by generating a large number of challenges.
   * Each challenge is printed to the browser console.
   * @public (debug)
   */
  testChallengeGenerators: function() {

    const testsPerLevel = 1000;

    for ( let i = 0; i < this.challengeGenerators.length; i++ ) {

      console.log( '>>> Testing level ' + ( i + 1 ) );
      const challengeGenerator = this.challengeGenerators[ i ];

      for ( let j = 0; j < testsPerLevel; j++ ) {
        const challenge = challengeGenerator.nextChallenge();
        console.log( j + ': ' + challenge.toString() );
      }
    }

    console.log( '>>> Tests passed for all levels' );
  }
} );