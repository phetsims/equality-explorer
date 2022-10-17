// Copyright 2018-2022, University of Colorado Boulder

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
import SolveItLevel from './SolveItLevel.js';
import ChallengeGenerator from './ChallengeGenerator.js';
import TModel from '../../../../joist/js/TModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import EqualityExplorerScene from '../../common/model/EqualityExplorerScene.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';

export default class SolveItModel extends PhetioObject implements TModel {

  public readonly challengeGenerators: ChallengeGenerator[];

  // a scene for each challenge generator
  public readonly scenes: SolveItLevel[];

  // the selected scene, null if no scene is currently selected
  public readonly sceneProperty: Property<SolveItLevel | null>;

  public constructor( tandem: Tandem ) {

    super( {
      tandem: tandem,
      phetioState: false
    } );

    this.challengeGenerators = [
      new ChallengeGenerator1(),
      new ChallengeGenerator2(),
      new ChallengeGenerator3(),
      new ChallengeGenerator4(),
      new ChallengeGenerator5()
    ];
    assert && assert( this.challengeGenerators.length === _.uniq( _.map( this.challengeGenerators, challengeGenerator => challengeGenerator.level ) ).length,
      'Challenge generators must have unique level numbers.' );
    assert && assert( _.every( this.challengeGenerators, ( value, index, array ) => ( index === 0 || array[ index - 1 ].level <= value.level ) ),
      'Challenge generators must be ordered by ascending level number.' );

    const levelsTandem = tandem.createTandem( 'levels' );
    this.scenes = _.map( this.challengeGenerators, challengeGenerator => new SolveItLevel( challengeGenerator, {
      tandem: levelsTandem.createTandem( `level${challengeGenerator.level}` )
    } ) );

    //TODO rename levelProperty
    this.sceneProperty = new Property<SolveItLevel | null>( null, {
      validValues: [ ...this.scenes, null ],
      tandem: tandem.createTandem( 'sceneProperty' ),
      phetioValueType: NullableIO( EqualityExplorerScene.EqualityExplorerSceneIO ),
      phetioDocumentation: 'null corresponds to the level-selection user interface'
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public reset(): void {
    this.challengeGenerators.forEach( challengeGenerator => challengeGenerator.reset() );
    this.scenes.forEach( scene => scene.reset() );
    this.sceneProperty.reset();
  }

  /**
   * Tests challenge generators by generating a large number of challenges.
   * Each challenge is printed to the browser console.
   * For debugging and testing.
   */
  public testChallengeGenerators(): void {

    const testsPerLevel = 1000;

    for ( let i = 0; i < this.challengeGenerators.length; i++ ) {

      console.log( `>>> Testing level ${i + 1}` );
      const challengeGenerator = this.challengeGenerators[ i ];

      for ( let j = 0; j < testsPerLevel; j++ ) {
        const challenge = challengeGenerator.nextChallenge();
        console.log( `${j}: ${challenge}` );
      }
    }

    console.log( '>>> Tests passed for all levels' );
  }
}

equalityExplorer.register( 'SolveItModel', SolveItModel );