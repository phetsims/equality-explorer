// Copyright 2022, University of Colorado Boulder

/**
 * SolveItInfoDialog describes the game levels in the 'Solve It!' screen.
 * This is intended primarily for use by teachers, to remind them of the types of challenges for each level.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Text } from '../../../../scenery/js/imports.js';
import GameInfoDialog from '../../../../vegas/js/GameInfoDialog.js';
import EqualityExplorerQueryParameters from '../../common/EqualityExplorerQueryParameters.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerStrings from '../../EqualityExplorerStrings.js';
import ChallengeGenerator from '../model/ChallengeGenerator.js';

export default class SolveItInfoDialog extends GameInfoDialog {

  private readonly disposeSolveItInfoDialog: () => void;

  public constructor( challengeGenerators: ChallengeGenerator[] ) {

    const descriptionProperties = challengeGenerators.map( challengeGenerator => challengeGenerator.descriptionProperty );

    const titleNode = new Text( EqualityExplorerStrings.levelsStringProperty, {
      font: new PhetFont( 32 )
    } );

    super( descriptionProperties, {
      gameLevels: EqualityExplorerQueryParameters.gameLevels,
      title: titleNode,
      ySpacing: 20,
      bottomMargin: 20
    } );

    this.disposeSolveItInfoDialog = () => {
      titleNode.dispose(); // for when titleNode is PhET-iO instrumented
    };
  }

  public override dispose(): void {
    this.disposeSolveItInfoDialog();
    super.dispose();
  }
}

equalityExplorer.register( 'SolveItInfoDialog', SolveItInfoDialog );