// Copyright 2018, University of Colorado Boulder

/**
 * User interface for game settings in the 'Solve It!' screen.
 * This is where you choose your level, turn sound on/off, reset the game, etc.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var EqualityExplorerLevelSelectionButton = require( 'EQUALITY_EXPLORER/solveit/view/EqualityExplorerLevelSelectionButton' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var InfoButton = require( 'SCENERY_PHET/buttons/InfoButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var InfoDialog = require( 'EQUALITY_EXPLORER/solveit/view/InfoDialog' );
  var MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
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
  function SettingsNode( model, layoutBounds ) {

    var self = this;

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

    // Info button, to right of 'Choose Your Level'
    // Created on demand. Reused so we don't have to deal with the myriad of problems related to Dialog dispose.
    var infoDialog = null;
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

    // Layout buttons horizontally
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
      listener: function() { model.reset(); }
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

    Node.call( this, {
      children: [
        solveForXNode,
        chooseYourLevelNode,
        infoButton,
        levelSelectionButtonsBox,
        soundButton,
        resetAllButton
      ]
    } );

    // When no scene is selected, make the Settings UI visible
    model.sceneProperty.link( function( scene ) {
      self.visible = ( scene === null );
    } );
  }

  equalityExplorer.register( 'SettingsNode', SettingsNode );

  return inherit( Node, SettingsNode );
} );

