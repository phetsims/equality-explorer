// Copyright 2022, University of Colorado Boulder

/**
 * SolveItInfoDialog describes the game levels in the 'Solve It!' screen.
 * This is intended primarily for use by teachers, to remind them of the types of challenges for each level.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Text } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GameInfoDialog from '../../../../vegas/js/GameInfoDialog.js';
import EqualityExplorerQueryParameters from '../../common/EqualityExplorerQueryParameters.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerStrings from '../../EqualityExplorerStrings.js';

export default class SolveItInfoDialog extends GameInfoDialog {

  private readonly disposeSolveItInfoDialog: () => void;

  public constructor( descriptionProperties: TReadOnlyProperty<string>[], tandem: Tandem ) {

    const titleText = new Text( EqualityExplorerStrings.levelsStringProperty, {
      font: new PhetFont( 32 )
    } );

    super( descriptionProperties, {
      gameLevels: EqualityExplorerQueryParameters.gameLevels,
      title: titleText,
      ySpacing: 20,
      bottomMargin: 20,
      tandem: tandem
    } );

    this.disposeSolveItInfoDialog = () => {
      titleText.dispose(); // for when titleText is PhET-iO instrumented
    };
  }

  public override dispose(): void {
    this.disposeSolveItInfoDialog();
    super.dispose();
  }
}

equalityExplorer.register( 'SolveItInfoDialog', SolveItInfoDialog );