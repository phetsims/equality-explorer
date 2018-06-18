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
   * @param {Object} [options]
   * @constructor
   */
  function LevelSelectionNode( model, layoutBounds, options ) {

    options = _.extend( {
      resetCallback: null // {function|null}
    }, options );

    var textOptions = {
      font: new PhetFont( 50 ),
      maxWidth: 0.65 * layoutBounds.width
    };

    // Level-selection buttons
    var levelSelectionButtons = [];
    model.scenes.forEach( function( scene ) {
      levelSelectionButtons.push( new EqualityExplorerLevelSelectionButton( scene, model.sceneProperty ) );
    } );

    // Layout the level-selection buttons horizontally
    var levelSelectionButtonsBox = new HBox( {
      children: levelSelectionButtons,
      spacing: 40,
      centerX: layoutBounds.centerX,
      top: layoutBounds.centerY - 25 // top of buttons slightly above center
    } );

    // 'Choose Your Level', centered above level-selection buttons
    var chooseYourLevelNode = new Text( chooseYourLevelString, _.extend( {}, textOptions, {
      centerX: levelSelectionButtonsBox.centerX,
      bottom: levelSelectionButtonsBox.top - 65
    } ) );

    // 'Solve for x', centered above 'Choose You Level'
    var solveForXText = StringUtils.fillIn( solveForString, {
      variable: MathSymbolFont.getRichTextMarkup( xString )
    } );
    var solveForXNode = new RichText( solveForXText, _.extend( {}, textOptions, {
      centerX: chooseYourLevelNode.centerX,
      bottom: chooseYourLevelNode.top - 30
    } ) );

    // Info dialog is created on demand, then reused so we don't have to deal with buggy Dialog.dispose.
    var infoDialog = null;

    // Info button, to right of 'Choose Your Level', opens the Info dialog.
    var infoButton = new InfoButton( {
      iconFill: 'rgb( 41, 106, 163 )',
      maxHeight: 0.75 * chooseYourLevelNode.height,
      listener: function() {
        infoDialog = infoDialog || new InfoDialog( model.levelDescriptions );
        infoDialog.show();
      },
      left: chooseYourLevelNode.right + 20,
      centerY: chooseYourLevelNode.centerY
    } );

    // Sound button, at lower left
    var soundButton = new SoundToggleButton( model.soundEnabledProperty, {
      stroke: 'gray',
      scale: 1.3,
      left: layoutBounds.minX + EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN,
      bottom: layoutBounds.maxY - EqualityExplorerConstants.SCREEN_VIEW_Y_MARGIN
    } );

    // Reset All button, at lower right
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        phet.log && phet.log( 'ResetAllButton pressed' );
        options.resetCallback && options.resetCallback();
      },
      right: layoutBounds.maxX - EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN,
      bottom: layoutBounds.maxY - EqualityExplorerConstants.SCREEN_VIEW_Y_MARGIN
    } );

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
    // Also disable if fuzzMouse is enabled, since this takes a long time and is not relevant to fuzz testing.
    if ( assert && EqualityExplorerQueryParameters.showAnswers && !phet.chipper.queryParameters.fuzzMouse ) {
      var testButton = new RectangularPushButton( {
        content: new Text( 'test challenge generators', { fill: 'white', font: new PhetFont( 20 ) } ),
        baseColor: 'red',
        listener: function() {
          model.testChallengeGenerators();
          var messageNode = new RichText( 'Test completed.<br>See results in browser console.' );
          var dialog = new Dialog( messageNode, {
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

  return inherit( Node, LevelSelectionNode );
} );

