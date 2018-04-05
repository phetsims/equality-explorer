// Copyright 2018, University of Colorado Boulder

/**
 * User interface for game settings in the 'Solve It!' screen.
 * This is where you choose your level, turn sound on/off, etc.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var Fraction = require( 'PHETCOMMON/model/Fraction' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var InfoButton = require( 'SCENERY_PHET/buttons/InfoButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var InfoDialog = require( 'EQUALITY_EXPLORER/solveit/view/InfoDialog' );
  var LevelSelectionItemNode = require( 'VEGAS/LevelSelectionItemNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VariableTermNode = require( 'EQUALITY_EXPLORER/common/view/VariableTermNode' );

  // strings
  var chooseYourLevelString = require( 'string!EQUALITY_EXPLORER/chooseYourLevel' );
  var solveForString = require( 'string!EQUALITY_EXPLORER/solveFor' );
  var xString = require( 'string!EQUALITY_EXPLORER/x' );

  /**
   * @param {SolveItModel} model
   * @param {Bounds2} layoutBounds
   * @param {Object} [options]
   * @constructor
   */
  function SettingsNode( model, layoutBounds, options ) {

    options = options || {};

    var textOptions = {
      font: new PhetFont( 50 ),
      maxWidth: 0.65 * layoutBounds.width,
      buttonListener: function( level ) {}
    };

    // 'Solve for x'
    var solveForXText = StringUtils.fillIn( solveForString, {
      variable: '<i><font face=\'"Times New Roman", Times, serif\'>' + xString + '</font></i>'
    } );
    var solveForXNode = new RichText( solveForXText, textOptions );

    // 'Choose Your Level'
    var chooseYourLevelNode = new Text( chooseYourLevelString, textOptions );

    // Info button, to right of 'Choose Your Level'
    var dialog = null;
    var infoButton = new InfoButton( {
      iconFill: 'rgb( 41, 106, 163 )',
      maxHeight: 0.75 * chooseYourLevelNode.height,
      listener: function() {
        dialog = dialog || new InfoDialog( model.levelDescriptions );
        dialog.show();
      }
    } );

    // Level-selection buttons
    var levelButtons = [];
    for ( var i = 0; i < model.scoreProperties.length; i++ ) {

      // IIFE to create a closure for level
      ( function( level ) {

        var icon = VariableTermNode.createInteractiveTermNode( Fraction.fromInteger( level + 1 ), xString, {
          diameter: 50,
          margin: 15,
          showOne: true
        } );

        var button = LevelSelectionItemNode.createWithScoreDisplayNumberAndStar( icon, model.scoreProperties[ level ], {
          baseColor: 'rgb( 191, 239, 254 )',
          listener: function() {
            options.buttonListener( level );
          }
        } );

        levelButtons.push( button );
      } )( i );
    }

    // Layout buttons horizontally
    var levelButtonsBox = new HBox( {
      children: levelButtons,
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
    levelButtonsBox.centerX = layoutBounds.centerX;
    levelButtonsBox.top = layoutBounds.centerY - 25; // top of buttons slightly above center
    chooseYourLevelNode.centerX = levelButtonsBox.centerX;
    chooseYourLevelNode.bottom = levelButtonsBox.top - 65;
    solveForXNode.centerX = chooseYourLevelNode.centerX;
    solveForXNode.bottom = chooseYourLevelNode.top - 30;
    infoButton.left = chooseYourLevelNode.right + 20;
    infoButton.centerY = chooseYourLevelNode.centerY;
    soundButton.left = layoutBounds.minX + EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN;
    soundButton.bottom = layoutBounds.maxY - EqualityExplorerConstants.SCREEN_VIEW_Y_MARGIN;
    resetAllButton.right = layoutBounds.maxX - EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN;
    resetAllButton.bottom = layoutBounds.maxY - EqualityExplorerConstants.SCREEN_VIEW_Y_MARGIN;

    assert && assert( !options.children, 'SettingsNode sets children' );
    options.children = [
      solveForXNode,
      chooseYourLevelNode,
      infoButton,
      levelButtonsBox,
      soundButton,
      resetAllButton
    ];

    Node.call( this, options );
  }

  equalityExplorer.register( 'SettingsNode', SettingsNode );

  return inherit( Node, SettingsNode );
} );

