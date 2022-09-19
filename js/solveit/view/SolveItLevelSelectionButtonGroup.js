// Copyright 2022, University of Colorado Boulder

// @ts-nocheck
/**
 * SolveItLevelSelectionButtonGroup is the group of level-selection buttons for the 'Solve It!' game.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import LevelSelectionButtonGroup from '../../../../vegas/js/LevelSelectionButtonGroup.js';
import ScoreDisplayNumberAndStar from '../../../../vegas/js/ScoreDisplayNumberAndStar.js';
import EqualityExplorerQueryParameters from '../../common/EqualityExplorerQueryParameters.js';
import VariableTermNode from '../../common/view/VariableTermNode.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerStrings from '../../EqualityExplorerStrings.js';

export default class SolveItLevelSelectionButtonGroup extends LevelSelectionButtonGroup {

  /**
   * @param {Property<SolveItScene|null>} sceneProperty
   * @param {SolveItScene[]} scenes
   * @param {Object} [options]
   */
  constructor( sceneProperty, scenes, options ) {

    options = merge( {
      levelSelectionButtonOptions: {
        baseColor: 'rgb( 191, 239, 254 )'
      },
      flowBoxOptions: {
        spacing: 20
      },
      gameLevels: EqualityExplorerQueryParameters.gameLevels
    }, options );

    // {LevelSelectionButtonGroup[]}
    const items = scenes.map( scene => {
      return {
        icon: VariableTermNode.createInteractiveTermNode(
          Fraction.fromInteger( scene.challengeGenerator.level ), EqualityExplorerStrings.x, {
            diameter: 50,
            margin: 15,
            showOne: true
          } ),
        scoreProperty: scene.scoreProperty,
        options: {
          createScoreDisplay: scoreProperty => new ScoreDisplayNumberAndStar( scoreProperty ),
          listener: () => {
            sceneProperty.value = scene;
          },
          soundPlayerIndex: scene.challengeGenerator.level - 1
        }
      };
    } );

    super( items, options );
  }
}

equalityExplorer.register( 'SolveItLevelSelectionButtonGroup', SolveItLevelSelectionButtonGroup );