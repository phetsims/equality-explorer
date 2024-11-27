// Copyright 2018-2023, University of Colorado Boulder

/**
 * User interface for level selection and other game settings in the 'Solve It!' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, NodeOptions, RichText, Text } from '../../../../scenery/js/imports.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import Dialog from '../../../../sun/js/Dialog.js';
import EqualityExplorerConstants from '../../common/EqualityExplorerConstants.js';
import EqualityExplorerDerivedStrings from '../../common/EqualityExplorerDerivedStrings.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerStrings from '../../EqualityExplorerStrings.js';
import SolveItModel from '../model/SolveItModel.js';
import SolveItInfoDialog from './SolveItInfoDialog.js';
import SolveItLevelSelectionButtonGroup from './SolveItLevelSelectionButtonGroup.js';

type SelfOptions = {

  // called when the Reset All button is pressed
  resetCallback: () => void;
};

type SolveItLevelSelectionNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class SolveItLevelSelectionNode extends Node {

  public constructor( model: SolveItModel, layoutBounds: Bounds2, providedOptions: SolveItLevelSelectionNodeOptions ) {

    const options = optionize<SolveItLevelSelectionNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      isDisposable: false,
      phetioVisiblePropertyInstrumented: false
    }, providedOptions );

    // Level-selection buttons
    const levelSelectionButtonGroup = new SolveItLevelSelectionButtonGroup( model.levelProperty, model.levels, {
      tandem: options.tandem.createTandem( 'levelSelectionButtonGroup' )
    } );
    levelSelectionButtonGroup.boundsProperty.link( bounds => {
      levelSelectionButtonGroup.centerX = layoutBounds.centerX;
      levelSelectionButtonGroup.top = layoutBounds.centerY - 25; // top of buttons slightly above center
    } );

    const textOptions = {
      font: new PhetFont( 50 ),
      maxWidth: 0.65 * layoutBounds.width
    };

    // 'Choose Your Level', centered above level-selection buttons
    const chooseYourLevelText = new Text( EqualityExplorerStrings.chooseYourLevelStringProperty, textOptions );
    chooseYourLevelText.boundsProperty.link( bounds => {
      chooseYourLevelText.centerX = levelSelectionButtonGroup.centerX;
      chooseYourLevelText.bottom = levelSelectionButtonGroup.top - 65;
    } );

    // 'Solve for x'
    const solveForXText = new RichText( EqualityExplorerDerivedStrings.solveForXStringProperty, textOptions );

    // Centered above 'Choose Your Level'
    solveForXText.boundsProperty.link( bounds => {
      solveForXText.centerX = chooseYourLevelText.centerX;
      solveForXText.bottom = chooseYourLevelText.top - 30;
    } );

    // Info dialog is created eagerly and reused, so we don't have to deal with PhetioCapsule.
    const infoDialog = new SolveItInfoDialog( model.levels.map( level => level.descriptionProperty ),
      options.tandem.createTandem( 'infoDialog' ) );

    // Info button, to right of 'Choose Your Level', opens the Info dialog.
    const infoButton = new InfoButton( {
      iconFill: 'rgb( 41, 106, 163 )',
      maxHeight: 0.75 * chooseYourLevelText.height,
      listener: () => {
        infoDialog.show();
      },
      tandem: options.tandem.createTandem( 'infoButton' )
    } );
    chooseYourLevelText.boundsProperty.link( bounds => {
      infoButton.left = chooseYourLevelText.right + 20;
      infoButton.centerY = chooseYourLevelText.centerY;
    } );

    // Reset All button, at lower right
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        phet.log && phet.log( 'ResetAllButton pressed' );
        options.resetCallback();
      },
      right: layoutBounds.maxX - EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN,
      bottom: layoutBounds.maxY - EqualityExplorerConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );

    const children: Node[] = [
      solveForXText,
      chooseYourLevelText,
      infoButton,
      levelSelectionButtonGroup,
      resetAllButton
    ];

    // Press this button to test challenge generators. See output in console.
    // This test is only useful if assertions are enabled.
    // Disable if fuzz is enabled, since this takes a long time and is not relevant to fuzz testing.
    // Note that this is conditional, so is not (and should be) instrumented for PhET-iO..
    if ( assert && phet.chipper.queryParameters.showAnswers && !phet.chipper.isFuzzEnabled() ) {
      const testButton = new RectangularPushButton( {
        content: new Text( 'Test challenge generators', { fill: 'white', font: new PhetFont( 20 ) } ),
        baseColor: 'red',
        listener: () => {
          model.testChallengeGenerators();
          const messageText = new RichText( 'Test completed.<br>See results in browser console.' );
          const dialog = new Dialog( messageText, {
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

    options.children = children;

    super( options );
  }
}

equalityExplorer.register( 'SolveItLevelSelectionNode', SolveItLevelSelectionNode );