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
import EqualityExplorerStrings from '../../EqualityExplorerStrings.js';
import EqualityExplorerConstants from '../../common/EqualityExplorerConstants.js';

export default class SolveItModel extends PhetioObject implements TModel {

  private readonly challengeGenerators: ChallengeGenerator[];

  // a level for each challenge generator
  public readonly levels: SolveItLevel[];

  // the selected level, null if no level is currently selected
  public readonly levelProperty: Property<SolveItLevel | null>;

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

    const descriptionProperties = [
      EqualityExplorerStrings.level1DescriptionStringProperty,
      EqualityExplorerStrings.level2DescriptionStringProperty,
      EqualityExplorerStrings.level3DescriptionStringProperty,
      EqualityExplorerStrings.level4DescriptionStringProperty,
      EqualityExplorerStrings.level5DescriptionStringProperty
    ];

    assert && assert( this.challengeGenerators.length === EqualityExplorerConstants.NUMBER_OF_GAME_LEVELS );
    assert && assert( descriptionProperties.length === EqualityExplorerConstants.NUMBER_OF_GAME_LEVELS );
    assert && assert( descriptionProperties.length === this.challengeGenerators.length );

    const levelsTandem = tandem.createTandem( 'levels' );
    this.levels = [];
    for ( let i = 0; i < this.challengeGenerators.length; i++ ) {
      const levelNumber = i + 1;
      this.levels.push( new SolveItLevel( descriptionProperties[ i ], this.challengeGenerators[ i ], {
        levelNumber: levelNumber,
        tandem: levelsTandem.createTandem( `level${levelNumber}` )
      } ) );
    }

    this.levelProperty = new Property<SolveItLevel | null>( null, {
      validValues: [ ...this.levels, null ],
      tandem: tandem.createTandem( 'levelProperty' ),
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
    this.levels.forEach( level => level.reset() );
    this.levelProperty.reset();
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