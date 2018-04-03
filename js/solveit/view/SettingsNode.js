// Copyright 2018, University of Colorado Boulder

/**
 * The user interface for selection game settings in the 'Solve It!' screen.
 * This is where you choose your level, turn sound on/off, etc.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var InfoButton = require( 'SCENERY_PHET/buttons/InfoButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LevelSelectionItemNode = require( 'VEGAS/LevelSelectionItemNode' );
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
   * @param {Object} [options]
   * @constructor
   */
  function SettingsNode( model, layoutBounds, options ) {

    options = options || {};

    var textOptions = {
      font: new PhetFont( 50 ),
      maxWidth: 0.65 * layoutBounds.width
    };

    // 'Solve for x'
    var solveForXText = StringUtils.fillIn( solveForString, {
      variable: '<i><font face=\'"Times New Roman", Times, serif\'>' + xString + '</font></i>'
    } );
    var solveForXNode = new RichText( solveForXText, textOptions );

    // 'Choose Your Level'
    var chooseYourLevelNode = new Text( chooseYourLevelString, textOptions );

    // Info button, to right of 'Choose Your Level'
    var infoButton = new InfoButton( {
      iconFill: 'rgb( 41, 106, 163 )',
      maxHeight: 0.75 * chooseYourLevelNode.height,
      listener: function() {
        //TODO
      }
    } );
    console.log( 'infoButton.height=' + infoButton.height );//XXX

    // Level-selection buttons
    var buttons = [];
    for ( var level = 0; level < model.scoreProperties.length; level++ ) {
      buttons.push( createLevelSelectionItemNode( level, model.scoreProperties[ level ], {
        baseColor: 'rgb( 191, 239, 254 )',
        listener: function() {
          //TODO
        }
      } ) );
    }

    // Layout buttons horizontally
    var buttonsBox = new HBox( {
      children: buttons,
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
    buttonsBox.centerX = layoutBounds.centerX;
    buttonsBox.top = layoutBounds.centerY - 25; // top of buttons slightly above center
    chooseYourLevelNode.centerX = buttonsBox.centerX;
    chooseYourLevelNode.bottom = buttonsBox.top - 65;
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
      buttonsBox,
      soundButton,
      resetAllButton
    ];

    Node.call( this, options );
  }

  equalityExplorer.register( 'SettingsNode', SettingsNode );

  /**
   * Creates a level-selection button
   * @param {number} level
   * @param {NumberProperty} scoreProperty
   * @param {Object} [options]
   * @returns {LevelSelectionItemNode}
   */
  var createLevelSelectionItemNode = function( level, scoreProperty, options ) {

    //TODO
    var icon = new Text( ( level + 1 ) + xString, {
      font: new PhetFont( 60 )
      //TODO maxWidth
    } );

    return LevelSelectionItemNode.createWithScoreDisplayNumberAndStar( icon, scoreProperty, options );
  };

  return inherit( Node, SettingsNode );
} );

