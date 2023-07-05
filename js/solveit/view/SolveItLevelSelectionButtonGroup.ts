// Copyright 2022-2023, University of Colorado Boulder

/**
 * SolveItLevelSelectionButtonGroup is the group of level-selection buttons for the 'Solve It!' game.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import TProperty from '../../../../axon/js/TProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import LevelSelectionButtonGroup, { LevelSelectionButtonGroupItem, LevelSelectionButtonGroupOptions } from '../../../../vegas/js/LevelSelectionButtonGroup.js';
import ScoreDisplayNumberAndStar from '../../../../vegas/js/ScoreDisplayNumberAndStar.js';
import EqualityExplorerQueryParameters from '../../common/EqualityExplorerQueryParameters.js';
import VariableTermNode from '../../common/view/VariableTermNode.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerStrings from '../../EqualityExplorerStrings.js';
import SolveItLevel from '../model/SolveItLevel.js';

type SelfOptions = EmptySelfOptions;

type SolveItLevelSelectionButtonGroupOptions = SelfOptions & PickRequired<LevelSelectionButtonGroup, 'tandem'>;

export default class SolveItLevelSelectionButtonGroup extends LevelSelectionButtonGroup {

  public constructor( levelProperty: Property<SolveItLevel | null>, levels: SolveItLevel[],
                      providedOptions: SolveItLevelSelectionButtonGroupOptions ) {

    const options = optionize<SolveItLevelSelectionButtonGroupOptions, SelfOptions, LevelSelectionButtonGroupOptions>()( {

      // LevelSelectionButtonGroupOptions
      isDisposable: false,
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
          Fraction.fromInteger( level.levelNumber ), EqualityExplorerStrings.xStringProperty, {
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
          soundPlayerIndex: level.levelNumber - 1 // levelNumber uses 1-based numbering
        }
      };
    } );

    super( items, options );
  }
}

equalityExplorer.register( 'SolveItLevelSelectionButtonGroup', SolveItLevelSelectionButtonGroup );