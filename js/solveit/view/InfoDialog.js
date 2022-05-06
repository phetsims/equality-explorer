// Copyright 2018-2021, University of Colorado Boulder

/**
 * Info dialog that explains the game levels in the 'Solve It!' screen.
 * This is intended primarily for use by teachers, to remind them of the types of challenges for each level.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { RichText } from '../../../../scenery/js/imports.js';
import { Text } from '../../../../scenery/js/imports.js';
import { VBox } from '../../../../scenery/js/imports.js';
import Dialog from '../../../../sun/js/Dialog.js';
import EqualityExplorerQueryParameters from '../../common/EqualityExplorerQueryParameters.js';
import equalityExplorer from '../../equalityExplorer.js';
import equalityExplorerStrings from '../../equalityExplorerStrings.js';

// constants
const TITLE_FONT = new PhetFont( 32 );
const LEVEL_INFO_FONT = new PhetFont( 24 );
const MAX_CONTENT_WIDTH = 600;

class InfoDialog extends Dialog {

  /**
   * @param {ChallengeGenerator[]} challengeGenerators
   */
  constructor( challengeGenerators ) {

    const children = challengeGenerators.map( challengeGenerator =>
      new LevelInfoText( challengeGenerator.level, challengeGenerator.description )
    );

    // Hide info for levels that are not included in gameLevels query parameter.
    // We must still create these Nodes so that we don't risk changing the PhET-iO API.
    if ( EqualityExplorerQueryParameters.gameLevels ) {
      children.forEach( node => {
        node.visible = EqualityExplorerQueryParameters.gameLevels.includes( node.level );
      } );
    }

    const content = new VBox( {
      align: 'left',
      spacing: 20,
      children: children,
      maxWidth: MAX_CONTENT_WIDTH // scale all descriptions uniformly
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

// The info description for a level
class LevelInfoText extends RichText {

  /**
   * @param {number} level
   * @param {string} description
   */
  constructor( level, description ) {
    super( description, {
      font: LEVEL_INFO_FONT
    } );
    this.level = level; // @public
  }
}

equalityExplorer.register( 'InfoDialog', InfoDialog );

export default InfoDialog;