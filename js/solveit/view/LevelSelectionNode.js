// Copyright 2018-2019, University of Colorado Boulder

/**
 * User interface for level selection and other game settings in the 'Solve It!' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import MathSymbolFont from '../../../../scenery-phet/js/MathSymbolFont.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import Dialog from '../../../../sun/js/Dialog.js';
import EqualityExplorerConstants from '../../common/EqualityExplorerConstants.js';
import equalityExplorerStrings from '../../equality-explorer-strings.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerLevelSelectionButton from './EqualityExplorerLevelSelectionButton.js';
import InfoDialog from './InfoDialog.js';

const chooseYourLevelString = equalityExplorerStrings.chooseYourLevel;
const solveForString = equalityExplorerStrings.solveFor;
const xString = equalityExplorerStrings.x;

/**
 * @param {SolveItModel} model
 * @param {Bounds2} layoutBounds
 * @param {Object} [options]
 * @constructor
 */
function LevelSelectionNode( model, layoutBounds, options ) {

  options = merge( {
    resetCallback: null // {function|null}
  }, options );

  const textOptions = {
    font: new PhetFont( 50 ),
    maxWidth: 0.65 * layoutBounds.width
  };

  // Level-selection buttons
  const levelSelectionButtons = [];
  model.scenes.forEach( function( scene ) {
    levelSelectionButtons.push( new EqualityExplorerLevelSelectionButton( scene, model.sceneProperty ) );
  } );

  // Layout the level-selection buttons horizontally
  const levelSelectionButtonsBox = new HBox( {
    children: levelSelectionButtons,
    spacing: 40,
    centerX: layoutBounds.centerX,
    top: layoutBounds.centerY - 25 // top of buttons slightly above center
  } );

  // 'Choose Your Level', centered above level-selection buttons
  const chooseYourLevelNode = new Text( chooseYourLevelString, merge( {}, textOptions, {
    centerX: levelSelectionButtonsBox.centerX,
    bottom: levelSelectionButtonsBox.top - 65
  } ) );

  // 'Solve for x', centered above 'Choose You Level'
  const solveForXText = StringUtils.fillIn( solveForString, {
    variable: MathSymbolFont.getRichTextMarkup( xString )
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
    listener: function() {
      infoDialog = infoDialog || new InfoDialog( model.levelDescriptions );
      infoDialog.show();
    },
    left: chooseYourLevelNode.right + 20,
    centerY: chooseYourLevelNode.centerY
  } );

  // Reset All button, at lower right
  const resetAllButton = new ResetAllButton( {
    listener: function() {
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
    levelSelectionButtonsBox,
    resetAllButton
  ];

  // Press this button to test challenge generators. See output in console.
  // This test is only useful if assertions are enabled.
  // Also disable if fuzz is enabled, since this takes a long time and is not relevant to fuzz testing.
  if ( assert && phet.chipper.queryParameters.showAnswers && !phet.chipper.queryParameters.fuzz ) {
    const testButton = new RectangularPushButton( {
      content: new Text( 'test challenge generators', { fill: 'white', font: new PhetFont( 20 ) } ),
      baseColor: 'red',
      listener: function() {
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

  Node.call( this, { children: children } );
}

equalityExplorer.register( 'LevelSelectionNode', LevelSelectionNode );

inherit( Node, LevelSelectionNode );
export default LevelSelectionNode;