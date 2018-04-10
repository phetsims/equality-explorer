// Copyright 2018, University of Colorado Boulder

/**
 * Display a scene in the 'Solve It!' screen.  Each scene corresponds to a game level.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BalanceScaleNode = require( 'EQUALITY_EXPLORER/common/view/BalanceScaleNode' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var EqualityExplorerRewardNode = require( 'EQUALITY_EXPLORER/solveit/view/EqualityExplorerRewardNode' );
  var EquationAccordionBox = require( 'EQUALITY_EXPLORER/common/view/EquationAccordionBox' );
  var FaceNode = require( 'SCENERY_PHET/FaceNode' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var RewardDialog = require( 'VEGAS/RewardDialog' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var ScoreDisplayNumberAndStar = require( 'VEGAS/ScoreDisplayNumberAndStar' );
  var SnapshotsAccordionBox = require( 'EQUALITY_EXPLORER/common/view/SnapshotsAccordionBox' );
  var StatusBar = require( 'VEGAS/StatusBar' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var UniversalOperationControl = require( 'EQUALITY_EXPLORER/common/view/UniversalOperationControl' );

  // strings
  var nextString = require( 'string!EQUALITY_EXPLORER/next' );
  var xString = require( 'string!EQUALITY_EXPLORER/x' );

  // constants
  var LEVEL_FONT = new PhetFont( 20 );
  var NEXT_BUTTON_FONT = new PhetFont( 20 );

  /**
   * @param {SolveItScene} scene - the scene associated with this Node
   * @param {Property.<SolveItScene|null>} sceneProperty - the selected scene
   * @param {Bounds2} layoutBounds
   * @param {Property.<Bounds2>} visibleBoundsProperty - visible bounds of this node's parent ScreenView
   * @param {GameAudioPlayer} gameAudioPlayer
   * @constructor
   */
  function SolveItSceneNode( scene, sceneProperty, layoutBounds, visibleBoundsProperty, gameAudioPlayer ) {

    var self = this;

    // @private view Properties
    this.snapshotsAccordionBoxExpandedProperty = new BooleanProperty( true );

    // Level description, displayed in the status bar
    var levelDescriptionNode = new RichText( scene.description, {
      font: LEVEL_FONT,
      maxWidth: 650 // determined empirically
    } );

    var scoreDisplay = new ScoreDisplayNumberAndStar( scene.scoreProperty );

    var backButtonListener = function() {
      sceneProperty.value = null; // back to the SettingsNode, where no scene is selected
    };

    // Bar across the top of the screen
    var statusBar = new StatusBar( layoutBounds, visibleBoundsProperty, levelDescriptionNode, scoreDisplay, {
      spacing: 20,
      backgroundFill: 'rgb( 252, 150, 152 )',
      backButtonListener: backButtonListener
    } );

    //TODO challenge is displayed here
    var challengeNode = new Rectangle( 0, 0, 520, 60, {
      stroke: 'rgb( 200, 200, 200 )',
      centerX: scene.scale.location.x,
      top: statusBar.bottom + 15
    } );

    //TODO factor EquationPanel out of EquationAccordionBox, use it here so we don't have expand/collapse button
    // Equation that reflects what is currently on the scale
    var equationAccordionBox = new EquationAccordionBox( scene.leftTermCreators, scene.rightTermCreators, {
      fixedWidth: challengeNode.width, // determined empirically, based on design mockups
      centerX: challengeNode.centerX,
      top: challengeNode.bottom + 15
    } );

    // Layer when universal operation animation occurs
    var operationAnimationLayer = new Node();

    // Universal Operation control
    var universalOperationControl = new UniversalOperationControl( scene, operationAnimationLayer, {
      centerX: scene.scale.location.x, // centered on the scale
      top: equationAccordionBox.bottom + 10
    } );

    // Scale
    var scaleNode = new BalanceScaleNode( scene.scale, {
      organizeButtonVisible: false
    } );

    // Snapshots
    var snapshotsAccordionBox = new SnapshotsAccordionBox( scene, {
      fixedWidth: ( layoutBounds.right - scaleNode.right ) - EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN - 15,
      expandedProperty: this.snapshotsAccordionBoxExpandedProperty,
      right: layoutBounds.right - EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN,
      top: statusBar.bottom + 20
    } );

    // Refresh button, generates a new challenge, effectively skipping the current challenge
    var refreshButton = new RectangularPushButton( {
      content: new FontAwesomeNode( 'refresh', { scale: 0.6 } ),
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      xMargin: 14,
      yMargin: 7,
      right: challengeNode.right,
      centerY: challengeNode.centerY,
      listener: function() {
        //TODO generate a new challenge
      }
    } );

    // Next button, takes us to the next challenge
    var nextButton = new RectangularPushButton( {
      visible: false,
      content: new Text( nextString, {
        font: NEXT_BUTTON_FONT,
        maxWidth: 100 // determined empirically
      } ),
      baseColor: PhetColorScheme.PHET_LOGO_YELLOW,
      xMargin: 12,
      yMargin: 8,
      right: challengeNode.right,
      centerY: challengeNode.centerY,

      listener: function() {

        //TODO temporary: Next button is a correct answer
        scene.scoreProperty.value++;
        gameAudioPlayer.correctAnswer();
      }
    } );

    //TODO set face location so it doesn't obscure solution
    // Smiley face, displayed when the challenge has been solved
    var faceNode = new FaceNode( 225, {
      opacity: 0.5,
      centerX: scaleNode.centerX,
      top: universalOperationControl.bottom + 25
    } );

    var children = [
      statusBar,
      challengeNode,
      equationAccordionBox,
      scaleNode,
      snapshotsAccordionBox,
      refreshButton,
      nextButton,
      faceNode,
      universalOperationControl,
      operationAnimationLayer
    ];

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

    // Make this node visible when its associated scene is selected.
    // unlink not needed
    sceneProperty.link( function( selectedScene ) {
      self.visible = ( scene === selectedScene );
    } );

    // @private {RewardDialog} dialog that is displayed when we reach GAME_REWARD_SCORE correct answers.
    // Created on demand. Reused so we don't have to deal with the myriad of problems related to Dialog dispose.
    this.rewardDialog = null;

    // @private {EqualityExplorerRewardNode} reward shown while rewardDialog is open
    this.rewardNode = null;

    // When the score reaches a magic number, display the reward.
    // unlink not needed.
    scene.scoreProperty.link( function( score ) {

      if ( score === EqualityExplorerConstants.GAME_REWARD_SCORE ) {

        gameAudioPlayer.gameOverPerfectScore();

        // show the reward dialog
        self.rewardDialog = self.rewardDialog || new RewardDialog( scene.scoreProperty.value, {

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
            self.rewardNode = new EqualityExplorerRewardNode( scene.levelNumber );
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
    } );
  }

  equalityExplorer.register( 'SolveItSceneNode', SolveItSceneNode );

  return inherit( Node, SolveItSceneNode, {

    // @public
    reset: function() {
      this.snapshotsAccordionBoxExpandedProperty.reset();
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