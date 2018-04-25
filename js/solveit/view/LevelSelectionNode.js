// Copyright 2018, University of Colorado Boulder

/**
 * User interface for level selection and other game settings in the 'Solve It!' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dialog = require( 'SUN/Dialog' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var EqualityExplorerLevelSelectionButton = require( 'EQUALITY_EXPLORER/solveit/view/EqualityExplorerLevelSelectionButton' );
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var InfoButton = require( 'SCENERY_PHET/buttons/InfoButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var InfoDialog = require( 'EQUALITY_EXPLORER/solveit/view/InfoDialog' );
  var MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var chooseYourLevelString = require( 'string!EQUALITY_EXPLORER/chooseYourLevel' );
  var solveForString = require( 'string!EQUALITY_EXPLORER/solveFor' );
  var xString = require( 'string!EQUALITY_EXPLORER/x' );

  /**
   * @param {SolveItModel} model
   * @param {Bounds2} layoutBounds
   * @constructor
   */
  function LevelSelectionNode( model, layoutBounds ) {

    var textOptions = {
      font: new PhetFont( 50 ),
      maxWidth: 0.65 * layoutBounds.width
    };

    // 'Solve for x'
    var solveForXText = StringUtils.fillIn( solveForString, {
      variable: MathSymbolFont.getRichTextMarkup( xString )
    } );
    var solveForXNode = new RichText( solveForXText, textOptions );

    // 'Choose Your Level'
    var chooseYourLevelNode = new Text( chooseYourLevelString, textOptions );

    // Info dialog is created on demand, then reused so we don't have to deal with buggy Dialog.dispose.
    var infoDialog = null;

    // Info button, to right of 'Choose Your Level', opens the Info dialog.
    var infoButton = new InfoButton( {
      iconFill: 'rgb( 41, 106, 163 )',
      maxHeight: 0.75 * chooseYourLevelNode.height,
      listener: function() {
        infoDialog = infoDialog || new InfoDialog( model.levelDescriptions );
        infoDialog.show();
      }
    } );

    // Level-selection buttons
    var levelSelectionButtons = [];
    model.scenes.forEach( function( scene ) {
      levelSelectionButtons.push( new EqualityExplorerLevelSelectionButton( scene, model.sceneProperty ) );
    } );

    // Layout the level-selection buttons horizontally
    var levelSelectionButtonsBox = new HBox( {
      children: levelSelectionButtons,
      spacing: 40
    } );

    // Sound button
    var soundButton = new SoundToggleButton( model.soundEnabledProperty, {
      stroke: 'gray',
      scale: 1.3
    } );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        phet.log && phet.log( 'ResetAllButton pressed' );
        model.reset();
      }
    } );

    // Layout
    levelSelectionButtonsBox.centerX = layoutBounds.centerX;
    levelSelectionButtonsBox.top = layoutBounds.centerY - 25; // top of buttons slightly above center
    chooseYourLevelNode.centerX = levelSelectionButtonsBox.centerX;
    chooseYourLevelNode.bottom = levelSelectionButtonsBox.top - 65;
    solveForXNode.centerX = chooseYourLevelNode.centerX;
    solveForXNode.bottom = chooseYourLevelNode.top - 30;
    infoButton.left = chooseYourLevelNode.right + 20;
    infoButton.centerY = chooseYourLevelNode.centerY;
    soundButton.left = layoutBounds.minX + EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN;
    soundButton.bottom = layoutBounds.maxY - EqualityExplorerConstants.SCREEN_VIEW_Y_MARGIN;
    resetAllButton.right = layoutBounds.maxX - EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN;
    resetAllButton.bottom = layoutBounds.maxY - EqualityExplorerConstants.SCREEN_VIEW_Y_MARGIN;

    var children = [
      solveForXNode,
      chooseYourLevelNode,
      infoButton,
      levelSelectionButtonsBox,
      soundButton,
      resetAllButton
    ];

    // Press this button to test challenge generators. See output in console.
    // This test is only useful if assertions are enabled.
    if ( assert && EqualityExplorerQueryParameters.showAnswers ) {
      var testButton = new RectangularPushButton( {
        content: new Text( 'test challenge generators', { fill: 'white', font: new PhetFont( 20 ) } ),
        baseColor: 'red',
        listener: function() {
          model.testChallengeGenerators();
          var messageNode = new RichText( 'Test completed.<br>See results in browser console.' );
          var dialog = new Dialog( messageNode );
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

  return inherit( Node, LevelSelectionNode );
} );

