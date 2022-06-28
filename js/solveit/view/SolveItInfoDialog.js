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
import equalityExplorerStrings from '../../equalityExplorerStrings.js';

const MAX_CONTENT_WIDTH = 600;

class SolveItInfoDialog extends GameInfoDialog {

  /**
   * @param {ChallengeGenerator[]} challengeGenerators
   */
  constructor( challengeGenerators ) {

    const descriptions = challengeGenerators.map( challengeGenerator => challengeGenerator.description );

    const titleNode = new Text( equalityExplorerStrings.levels, {
      font: new PhetFont( 32 ),
      maxWidth: 0.75 * MAX_CONTENT_WIDTH
    } );

    super( descriptions, {
      gameLevels: EqualityExplorerQueryParameters.gameLevels,
      title: titleNode,
      vBoxOptions: {
        align: 'left',
        spacing: 20,
        maxWidth: MAX_CONTENT_WIDTH // scale all descriptions uniformly
      },
      descriptionTextOptions: {
        font: new PhetFont( 24 )
      },
      ySpacing: 20,
      bottomMargin: 20
    } );
  }
}

equalityExplorer.register( 'SolveItInfoDialog', SolveItInfoDialog );

export default SolveItInfoDialog;