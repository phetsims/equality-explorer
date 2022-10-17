// Copyright 2022, University of Colorado Boulder

/**
 * SolveItLevelSelectionButtonGroup is the group of level-selection buttons for the 'Solve It!' game.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import TProperty from '../../../../axon/js/TProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import { NodeTranslationOptions } from '../../../../scenery/js/imports.js';
import LevelSelectionButtonGroup, { LevelSelectionButtonGroupItem, LevelSelectionButtonGroupOptions } from '../../../../vegas/js/LevelSelectionButtonGroup.js';
import ScoreDisplayNumberAndStar from '../../../../vegas/js/ScoreDisplayNumberAndStar.js';
import EqualityExplorerQueryParameters from '../../common/EqualityExplorerQueryParameters.js';
import VariableTermNode from '../../common/view/VariableTermNode.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerStrings from '../../EqualityExplorerStrings.js';
import SolveItLevel from '../model/SolveItLevel.js';

type SelfOptions = EmptySelfOptions;

type SolveItLevelSelectionButtonGroupOptions = SelfOptions & NodeTranslationOptions;

export default class SolveItLevelSelectionButtonGroup extends LevelSelectionButtonGroup {

  public constructor( levelProperty: Property<SolveItLevel | null>, levels: SolveItLevel[],
                      providedOptions?: SolveItLevelSelectionButtonGroupOptions ) {

    const options = optionize<SolveItLevelSelectionButtonGroupOptions, SelfOptions, LevelSelectionButtonGroupOptions>()( {

      // LevelSelectionButtonGroupOptions
      levelSelectionButtonOptions: {
        baseColor: 'rgb( 191, 239, 254 )'
      },
      flowBoxOptions: {
        spacing: 20
      },
      gameLevels: EqualityExplorerQueryParameters.gameLevels
    }, providedOptions );

    const items: LevelSelectionButtonGroupItem[] = levels.map( level => {
      return {
        icon: VariableTermNode.createInteractiveTermNode(
          Fraction.fromInteger( level.challengeGenerator.level ), EqualityExplorerStrings.xStringProperty, {
            diameter: 50,
            margin: 15,
            equationTermNodeOptions: {
              showOne: true
            }
          } ),
        scoreProperty: level.scoreProperty,
        options: {
          createScoreDisplay: ( scoreProperty: TProperty<number> ) => new ScoreDisplayNumberAndStar( scoreProperty ),
          listener: () => {
            levelProperty.value = level;
          },
          soundPlayerIndex: level.challengeGenerator.level - 1
        }
      };
    } );

    super( items, options );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

equalityExplorer.register( 'SolveItLevelSelectionButtonGroup', SolveItLevelSelectionButtonGroup );