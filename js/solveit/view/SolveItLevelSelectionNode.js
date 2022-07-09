// Copyright 2018-2022, University of Colorado Boulder

/**
 * User interface for level selection and other game settings in the 'Solve It!' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import MathSymbolFont from '../../../../scenery-phet/js/MathSymbolFont.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, RichText, Text } from '../../../../scenery/js/imports.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import Dialog from '../../../../sun/js/Dialog.js';
import EqualityExplorerConstants from '../../common/EqualityExplorerConstants.js';
import equalityExplorer from '../../equalityExplorer.js';
import equalityExplorerStrings from '../../equalityExplorerStrings.js';
import SolveItInfoDialog from './SolveItInfoDialog.js';
import SolveItLevelSelectionButtonGroup from './SolveItLevelSelectionButtonGroup.js';

class SolveItLevelSelectionNode extends Node {

  /**
   * @param {SolveItModel} model
   * @param {Bounds2} layoutBounds
   * @param {Object} [options]
   */
  constructor( model, layoutBounds, options ) {

    options = merge( {
      resetCallback: null // {function|null}
    }, options );

    // Level-selection buttons
    const levelSelectionButtonGroup = new SolveItLevelSelectionButtonGroup( model.sceneProperty, model.scenes, {
      centerX: layoutBounds.centerX,
      top: layoutBounds.centerY - 25 // top of buttons slightly above center
    } );

    const textOptions = {
      font: new PhetFont( 50 ),
      maxWidth: 0.65 * layoutBounds.width
    };

    // 'Choose Your Level', centered above level-selection buttons
    const chooseYourLevelNode = new Text( equalityExplorerStrings.chooseYourLevel, merge( {}, textOptions, {
      centerX: levelSelectionButtonGroup.centerX,
      bottom: levelSelectionButtonGroup.top - 65
    } ) );

    // 'Solve for x', centered above 'Choose You Level'
    const solveForXText = StringUtils.fillIn( equalityExplorerStrings.solveFor, {
      variable: MathSymbolFont.getRichTextMarkup( equalityExplorerStrings.x )
    } );
    const solveForXNode = new RichText( solveForXText, merge( {}, textOptions, {
      centerX: chooseYourLevelNode.centerX,
      bottom: chooseYourLevelNode.top - 30
    } ) );

    // Info dialog is created on demand, then reused so we don't have to deal with buggy Dialog.dispose.
    let infoDialog = null;

    // Info button, to right of 'Choose Your Level', opens the Info dialog.
    const infoButton = new InfoButton( {
      iconFill: 'rgb( 41, 106, 163 )',
      maxHeight: 0.75 * chooseYourLevelNode.height,
      listener: () => {
        infoDialog = infoDialog || new SolveItInfoDialog( model.challengeGenerators );
        infoDialog.show();
      },
      left: chooseYourLevelNode.right + 20,
      centerY: chooseYourLevelNode.centerY
    } );

    // Reset All button, at lower right
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        phet.log && phet.log( 'ResetAllButton pressed' );
        options.resetCallback && options.resetCallback();
      },
      right: layoutBounds.maxX - EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN,
      bottom: layoutBounds.maxY - EqualityExplorerConstants.SCREEN_VIEW_Y_MARGIN
    } );

    const children = [
      solveForXNode,
      chooseYourLevelNode,
      infoButton,
      levelSelectionButtonGroup,
      resetAllButton
    ];

    // Press this button to test challenge generators. See output in console.
    // This test is only useful if assertions are enabled.
    // Also disable if fuzz is enabled, since this takes a long time and is not relevant to fuzz testing.
    if ( assert && phet.chipper.queryParameters.showAnswers && !phet.chipper.isFuzzEnabled() ) {
      const testButton = new RectangularPushButton( {
        content: new Text( 'test challenge generators', { fill: 'white', font: new PhetFont( 20 ) } ),
        baseColor: 'red',
        listener: () => {
          model.testChallengeGenerators();
          const messageNode = new RichText( 'Test completed.<br>See results in browser console.' );
          const dialog = new Dialog( messageNode, {
            topMargin: 20,
            bottomMargin: 20,
            leftMargin: 20,
            rightMargin: 20
          } );
          dialog.show();
        },
        centerX: layoutBounds.centerX,
        bottom: layoutBounds.bottom - 20
      } );
      children.push( testButton );
    }

    super( { children: children } );
  }
}

equalityExplorer.register( 'SolveItLevelSelectionNode', SolveItLevelSelectionNode );

export default SolveItLevelSelectionNode;