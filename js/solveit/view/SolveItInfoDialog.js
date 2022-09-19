// Copyright 2022, University of Colorado Boulder

// @ts-nocheck
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

export default class SolveItInfoDialog extends GameInfoDialog {

  /**
   * @param {ChallengeGenerator[]} challengeGenerators
   */
  constructor( challengeGenerators ) {

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
  }
}

equalityExplorer.register( 'SolveItInfoDialog', SolveItInfoDialog );