// Copyright 2018-2022, University of Colorado Boulder

/**
 * User interface for level selection and other game settings in the 'Solve It!' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
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
import EqualityExplorerStrings from '../../EqualityExplorerStrings.js';
import SolveItModel from '../model/SolveItModel.js';
import SolveItInfoDialog from './SolveItInfoDialog.js';
import SolveItLevelSelectionButtonGroup from './SolveItLevelSelectionButtonGroup.js';

type SelfOptions = {

  // called when the Reset All button is pressed
  resetCallback: () => void;
};

type SolveItLevelSelectionNodeOptions = SelfOptions;

export default class SolveItLevelSelectionNode extends Node {

  public constructor( model: SolveItModel, layoutBounds: Bounds2, providedOptions: SolveItLevelSelectionNodeOptions ) {

    const options = providedOptions;

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
    const chooseYourLevelNode = new Text( EqualityExplorerStrings.chooseYourLevelStringProperty, textOptions );
    chooseYourLevelNode.boundsProperty.link( bounds => {
      chooseYourLevelNode.centerX = levelSelectionButtonGroup.centerX;
      chooseYourLevelNode.bottom = levelSelectionButtonGroup.top - 65;
    } );

    // 'Solve for x', centered above 'Choose Your Level'
    const solveToXStringProperty = new DerivedProperty(
      [ EqualityExplorerStrings.solveForStringProperty, EqualityExplorerStrings.xStringProperty ],
      ( solveForString, xString ) => StringUtils.fillIn( solveForString, {
        variable: MathSymbolFont.getRichTextMarkup( xString )
      } ) );
    const solveForXNode = new RichText( solveToXStringProperty, textOptions );
    solveForXNode.boundsProperty.link( bounds => {
      solveForXNode.centerX = chooseYourLevelNode.centerX;
      solveForXNode.bottom = chooseYourLevelNode.top - 30;
    } );

    // Info dialog is created eagerly and reused, so we don't have to deal with PhetioCapsule.
    const infoDialog = new SolveItInfoDialog( model.challengeGenerators );

    // Info button, to right of 'Choose Your Level', opens the Info dialog.
    const infoButton = new InfoButton( {
      iconFill: 'rgb( 41, 106, 163 )',
      maxHeight: 0.75 * chooseYourLevelNode.height,
      listener: () => {
        infoDialog.show();
      }
    } );
    chooseYourLevelNode.boundsProperty.link( bounds => {
      infoButton.left = chooseYourLevelNode.right + 20;
      infoButton.centerY = chooseYourLevelNode.centerY;
    } );

    // Reset All button, at lower right
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        phet.log && phet.log( 'ResetAllButton pressed' );
        options.resetCallback();
      },
      right: layoutBounds.maxX - EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN,
      bottom: layoutBounds.maxY - EqualityExplorerConstants.SCREEN_VIEW_Y_MARGIN
    } );

    const children: Node[] = [
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
            leftMargin: 20
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

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

equalityExplorer.register( 'SolveItLevelSelectionNode', SolveItLevelSelectionNode );