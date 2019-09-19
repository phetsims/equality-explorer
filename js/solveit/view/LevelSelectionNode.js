// Copyright 2018-2019, University of Colorado Boulder

/**
 * User interface for level selection and other game settings in the 'Solve It!' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Dialog = require( 'SUN/Dialog' );
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  const EqualityExplorerLevelSelectionButton = require( 'EQUALITY_EXPLORER/solveit/view/EqualityExplorerLevelSelectionButton' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const InfoButton = require( 'SCENERY_PHET/buttons/InfoButton' );
  const InfoDialog = require( 'EQUALITY_EXPLORER/solveit/view/InfoDialog' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const chooseYourLevelString = require( 'string!EQUALITY_EXPLORER/chooseYourLevel' );
  const solveForString = require( 'string!EQUALITY_EXPLORER/solveFor' );
  const xString = require( 'string!EQUALITY_EXPLORER/x' );

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
      resetAllButton
    ];

    // Press this button to test challenge generators. See output in console.
    // This test is only useful if assertions are enabled.
    // Also disable if fuzz is enabled, since this takes a long time and is not relevant to fuzz testing.
    if ( assert && phet.chipper.queryParameters.showAnswers && !phet.chipper.queryParameters.fuzz ) {
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

