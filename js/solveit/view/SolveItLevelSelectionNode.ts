// Copyright 2018-2022, University of Colorado Boulder

/**
 * User interface for level selection and other game settings in the 'Solve It!' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import MathSymbolFont from '../../../../scenery-phet/js/MathSymbolFont.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, NodeOptions, RichText, Text, TextOptions } from '../../../../scenery/js/imports.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import Dialog from '../../../../sun/js/Dialog.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
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

type SolveItLevelSelectionNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class SolveItLevelSelectionNode extends Node {

  public constructor( model: SolveItModel, layoutBounds: Bounds2, providedOptions: SolveItLevelSelectionNodeOptions ) {

    const options = optionize<SolveItLevelSelectionNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      phetioVisiblePropertyInstrumented: false
    }, providedOptions );

    // Level-selection buttons
    const levelSelectionButtonGroup = new SolveItLevelSelectionButtonGroup( model.levelProperty, model.levels, {
      centerX: layoutBounds.centerX,
      top: layoutBounds.centerY - 25 // top of buttons slightly above center
    } );

    const textOptions = {
      font: new PhetFont( 50 ),
      maxWidth: 0.65 * layoutBounds.width
    };

    // Organize the 2 lines of the title under a parent tandem.
    const titleTandem = options.tandem.createTandem( 'title' );

    // 'Choose Your Level', centered above level-selection buttons
    const chooseYourLevelText = new Text( EqualityExplorerStrings.chooseYourLevelStringProperty,
      combineOptions<TextOptions>( {
        tandem: titleTandem.createTandem( 'chooseYourLevelText' )
      }, textOptions ) );
    chooseYourLevelText.boundsProperty.link( bounds => {
      chooseYourLevelText.centerX = levelSelectionButtonGroup.centerX;
      chooseYourLevelText.bottom = levelSelectionButtonGroup.top - 65;
    } );

    // 'Solve for x', centered above 'Choose Your Level'
    const solveForXTextTandem = titleTandem.createTandem( 'solveForXText' );
    const solveForXStringProperty = new DerivedProperty(
      [ EqualityExplorerStrings.solveForStringProperty, EqualityExplorerStrings.xStringProperty ],
      ( solveForString, xString ) => StringUtils.fillIn( solveForString, {
        variable: MathSymbolFont.getRichTextMarkup( xString )
      } ), {
        tandem: solveForXTextTandem.createTandem( RichText.STRING_PROPERTY_TANDEM_NAME ),
        phetioValueType: StringIO
      } );
    const solveForXText = new RichText( solveForXStringProperty, combineOptions<TextOptions>( {
      tandem: solveForXTextTandem
    }, textOptions ) );
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
    // Also disable if fuzz is enabled, since this takes a long time and is not relevant to fuzz testing.
    if ( assert && phet.chipper.queryParameters.showAnswers && !phet.chipper.isFuzzEnabled() ) {
      const testButton = new RectangularPushButton( {
        content: new Text( 'test challenge generators', { fill: 'white', font: new PhetFont( 20 ) } ),
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

    super( { children: children } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

equalityExplorer.register( 'SolveItLevelSelectionNode', SolveItLevelSelectionNode );