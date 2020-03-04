// Copyright 2018-2020, University of Colorado Boulder

/**
 * Level (scene) selection button in the 'Solve It!' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import LevelSelectionButton from '../../../../vegas/js/LevelSelectionButton.js';
import ScoreDisplayNumberAndStar from '../../../../vegas/js/ScoreDisplayNumberAndStar.js';
import VariableTermNode from '../../common/view/VariableTermNode.js';
import equalityExplorerStrings from '../../equality-explorer-strings.js';
import equalityExplorer from '../../equalityExplorer.js';

// strings
const xString = equalityExplorerStrings.x;

class EqualityExplorerLevelSelectionButton extends LevelSelectionButton {

  /**
   * @param {SolveItScene} scene - the scene that will be selected by pressing this button
   * @param {Property.<SolveItScene>} sceneProperty - the selected scene
   */
  constructor( scene, sceneProperty ) {

    // 'x' term with level number as coefficient
    const icon = VariableTermNode.createInteractiveTermNode( Fraction.fromInteger( scene.level ), xString, {
      diameter: 50,
      margin: 15,
      showOne: true
    } );

    super( icon, scene.scoreProperty, {
      baseColor: 'rgb( 191, 239, 254 )',
      scoreDisplayConstructor: ScoreDisplayNumberAndStar,
      listener: () => {
        phet.log && phet.log( 'Level' + scene.level + ' button pressed' );
        sceneProperty.value = scene;
      }
    } );
  }
}

equalityExplorer.register( 'EqualityExplorerLevelSelectionButton', EqualityExplorerLevelSelectionButton );

export default EqualityExplorerLevelSelectionButton;