// Copyright 2018-2020, University of Colorado Boulder

/**
 * Info dialog that explains the game levels in the 'Solve It!' screen.
 * This is intended primarily for use by teachers, to remind them of the types of challenges for each level.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Dialog from '../../../../sun/js/Dialog.js';
import equalityExplorer from '../../equalityExplorer.js';
import equalityExplorerStrings from '../../equalityExplorerStrings.js';

// constants
const TITLE_FONT = new PhetFont( 32 );
const DESCRIPTION_FONT = new PhetFont( 24 );
const MAX_CONTENT_WIDTH = 600;

class InfoDialog extends Dialog {

  /**
   * @param {ChallengeGenerator[]} challengeGenerators
   */
  constructor( challengeGenerators ) {

    const children = [];
    challengeGenerators.forEach( challengeGenerators =>
      children.push( new RichText( challengeGenerators.description, {
        font: DESCRIPTION_FONT
      } ) )
    );

    const content = new VBox( {
      align: 'left',
      spacing: 20,
      children: children,
      maxWidth: MAX_CONTENT_WIDTH // scale all of the descriptions uniformly
    } );

    const titleNode = new Text( equalityExplorerStrings.levels, {
      font: TITLE_FONT,
      maxWidth: 0.75 * MAX_CONTENT_WIDTH
    } );

    super( content, {
      title: titleNode,
      ySpacing: 20,
      bottomMargin: 20
    } );
  }
}

equalityExplorer.register( 'InfoDialog', InfoDialog );

export default InfoDialog;