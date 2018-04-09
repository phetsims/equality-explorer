// Copyright 2018, University of Colorado Boulder

/**
 * User interface for playing the game in the 'Solve It!' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var EqualityExplorerRewardNode = require( 'EQUALITY_EXPLORER/solveit/view/EqualityExplorerRewardNode' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var GameAudioPlayer = require( 'VEGAS/GameAudioPlayer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var RewardDialog = require( 'VEGAS/RewardDialog' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var ScoreDisplayNumberAndStar = require( 'VEGAS/ScoreDisplayNumberAndStar' );
  var StatusBar = require( 'VEGAS/StatusBar' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var nextString = require( 'string!EQUALITY_EXPLORER/next' );
  var xString = require( 'string!EQUALITY_EXPLORER/x' );

  // constants
  var LEVEL_FONT = new PhetFont( 20 );
  var NEXT_BUTTON_FONT = new PhetFont( 20 );

  /**
   * @param {SolveItModel} model
   * @param {Bounds2} layoutBounds
   * @param {Property.<Bounds2>} visibleBoundsProperty - visible bounds of this node's parent ScreenView
   * @constructor
   */
  function PlayingNode( model, layoutBounds, visibleBoundsProperty ) {

    var self = this;

    var gameAudioPlayer = new GameAudioPlayer( model.soundEnabledProperty );

    var levelNode = new RichText( model.levelProperty.value.description, {
      font: LEVEL_FONT,
      maxWidth: 650 // determined empirically
    } );

    var scoreProperty = new NumberProperty( 0, {
      numberType: 'Integer'
    } );
    scoreProperty.link( function( score ) {
      model.levelProperty.value.scoreProperty.value = score;
    } );

    var scoreDisplay = new ScoreDisplayNumberAndStar( scoreProperty );

    var backButtonListener = function() {
      model.stateProperty.value = 'settings';
    };

    var statusBar = new StatusBar( layoutBounds, visibleBoundsProperty, levelNode, scoreDisplay, {
      spacing: 20,
      backgroundFill: 'rgb( 252, 150, 152 )',
      backButtonListener: backButtonListener
    } );

    var refreshButton = new RectangularPushButton( {
      content: new FontAwesomeNode( 'refresh', { scale: 0.6 } ),
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      xMargin: 14,
      yMargin: 7,
      right: statusBar.centerX - 20,
      top: statusBar.bottom + 30,
      listener: function() {
        //TODO generate a new challenge
      }
    } );

    // @private {RewardDialog} dialog that is displayed when we reach 10 correct answers.
    // Created on demand. Reused so we don't have to deal with the myriad of problems related to Dialog dispose.
    this.rewardDialog = null;

    // @private {EqualityExplorerRewardNode} reward shown while rewardDialog is open
    this.rewardNode = null;

    var nextButton = new RectangularPushButton( {
      content: new Text( nextString, {
        font: NEXT_BUTTON_FONT,
        maxWidth: 100 // determined empirically
      } ),
      baseColor: PhetColorScheme.PHET_LOGO_YELLOW,
      xMargin: 12,
      yMargin: 8,
      left: statusBar.centerX + 30,
      top: statusBar.bottom + 30,

      listener: function() {

        //TODO temporary: Next button is a correct answer
        scoreProperty.value++;

        // When the score reaches a magic number, display a reward dialog
        if ( scoreProperty.value === model.rewardScore ) {

          gameAudioPlayer.gameOverPerfectScore();

          // show the reward dialog
          self.rewardDialog = self.rewardDialog || new RewardDialog( scoreProperty.value, {

            // 'Keep Going' hides the dialog
            keepGoingButtonListener: function() {
              self.rewardDialog.hide();
            },

            // 'New Level' has the same effect as the back button in the status bar
            newLevelButtonListener: function() {
              self.rewardDialog.hide();
              backButtonListener();
            },

            // When the dialog is shown, show the reward
            showCallback: function() {
              assert && assert( !self.rewardNode, 'rewardNode is not supposed to exist' );
              self.rewardNode = new EqualityExplorerRewardNode( model.levelProperty.value.levelNumber );
              self.addChild( self.rewardNode );
            },

            // When the dialog is hidden, dispose of the reward
            hideCallback: function() {
              assert && assert( self.rewardNode, 'rewardNode is supposed to exist' );
              self.removeChild( self.rewardNode );
              self.rewardNode.dispose();
              self.rewardNode = null;
            }
          } );
          self.rewardDialog.show();
        }
        else {

          //TODO temporary: Next button is a correct answer
          gameAudioPlayer.correctAnswer();
        }
      }
    } );

    var children = [ statusBar, refreshButton, nextButton ];

    // @private {RichText|null} shows the answer for debugging/testing
    this.answerNode = null;
    if ( EqualityExplorerQueryParameters.showAnswers ) {
      var answerText = StringUtils.fillIn( '{{x}} = {{value}}', {
        x: MathSymbolFont.getRichTextMarkup( xString ),
        value: '?' //TODO show value of x, update when challenge changes
      } );
      this.answerNode = new RichText( answerText, {
        right: layoutBounds.maxX - EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN,
        bottom: layoutBounds.maxY - EqualityExplorerConstants.SCREEN_VIEW_Y_MARGIN
      } );
      children.push( this.answerNode );
    }

    Node.call( this, {
      children: children
    } );

    var updateScore = function( score ) {
      scoreProperty.value = score;
    };

    // When the level changes, update the level description and listen to the correct score
    model.levelProperty.link( function( level, oldLevel ) {
      levelNode.text = level.description;
      if ( oldLevel !== null ) {
        oldLevel.scoreProperty.unlink( updateScore );
      }
      level.scoreProperty.link( updateScore );
    } );

    // @private
    this.disposePlayingNode = function() {
      scoreDisplay.dispose();
      statusBar.dispose();
    };
  }

  equalityExplorer.register( 'PlayingNode', PlayingNode );

  return inherit( Node, PlayingNode, {

    // @public
    dispose: function() {
      this.disposePlayingNode();
      Node.prototype.dispose.call( this );
    },

    /**
     * @param {number} dt - elapsed time, in seconds
     * @public
     */
    step: function( dt ) {
      this.rewardNode && this.rewardNode.step( dt );
    }
  } );
} );