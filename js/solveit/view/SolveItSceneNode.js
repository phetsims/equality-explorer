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
  var DebugChallengeNode = require( 'EQUALITY_EXPLORER/solveit/view/DebugChallengeNode' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var EqualityExplorerRewardNode = require( 'EQUALITY_EXPLORER/solveit/view/EqualityExplorerRewardNode' );
  var EquationPanel = require( 'EQUALITY_EXPLORER/common/view/EquationPanel' );
  var FaceNode = require( 'SCENERY_PHET/FaceNode' );
  var InfiniteStatusBar = require( 'VEGAS/InfiniteStatusBar' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var RefreshButton = require( 'SCENERY_PHET/buttons/RefreshButton' );
  var RewardDialog = require( 'VEGAS/RewardDialog' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var SceneNode = require( 'EQUALITY_EXPLORER/common/view/SceneNode' );
  var SnapshotsAccordionBox = require( 'EQUALITY_EXPLORER/common/view/SnapshotsAccordionBox' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var UniversalOperationControl = require( 'EQUALITY_EXPLORER/common/view/UniversalOperationControl' );

  // strings
  var nextString = require( 'string!EQUALITY_EXPLORER/next' );
  var solveForString = require( 'string!EQUALITY_EXPLORER/solveFor' );
  var xString = require( 'string!EQUALITY_EXPLORER/x' );

  // constants
  var LEVEL_FONT = new PhetFont( 20 );
  var NEXT_BUTTON_FONT = new PhetFont( 20 );

  /**
   * @param {SolveItScene} scene - the scene associated with this Node
   * @param {Property.<SolveItScene|null>} sceneProperty - the selected scene
   * @param {Bounds2} layoutBounds - of the parent ScreenView
   * @param {Property.<Bounds2>} visibleBoundsProperty - of the parent ScreenView
   * @param {GameAudioPlayer} gameAudioPlayer
   * @param {Object} [options]
   * @constructor
   */
  function SolveItSceneNode( scene, sceneProperty, layoutBounds, visibleBoundsProperty, gameAudioPlayer, options ) {

    var self = this;

    options = _.extend( {

      // terms are not interactive in this screen, all interaction is with the universal operation control
      termNodesPickable: false
    }, options );

    // @private view Properties
    this.snapshotsAccordionBoxExpandedProperty = new BooleanProperty( true );

    // Level description, displayed in the status bar
    var levelDescriptionNode = new RichText( scene.description, {
      font: LEVEL_FONT,
      maxWidth: 650 // determined empirically
    } );

    var backButtonListener = function() {
      sceneProperty.value = null; // back to the SettingsNode, where no scene is selected
    };

    // Bar across the top of the screen
    var statusBar = new InfiniteStatusBar( layoutBounds, visibleBoundsProperty, levelDescriptionNode, scene.scoreProperty, {
      spacing: 20,
      barFill: 'rgb( 252, 150, 152 )',
      backButtonListener: backButtonListener
    } );

    //TODO replace this each time the challenge changes, use EquationNode.updateEnabled:false
    // Challenge equation
    var challengePanel = new EquationPanel( scene.leftTermCreators, scene.rightTermCreators, {
      contentWidth: 540, // determined empirically, based on design mockups
      stroke: null,
      fill: null,
      centerX: scene.scale.location.x,
      top: statusBar.bottom + 15
    } );

    // 'Solve for x'
    var solveForXText = StringUtils.fillIn( solveForString, {
      variable: MathSymbolFont.getRichTextMarkup( xString )
    } );
    var solveForXNode = new RichText( solveForXText, {
      font: new PhetFont( { size: 20, weight: 'bold' } ),
      left: challengePanel.left,
      centerY: challengePanel.centerY,
      maxWidth: 125 // determined empirically
    } );

    // Equation that reflects what is currently on the scale
    var equationPanel = new EquationPanel( scene.leftTermCreators, scene.rightTermCreators, {
      contentWidth: challengePanel.width, // determined empirically, based on design mockups
      stroke: 'black',
      fill: 'white',
      centerX: challengePanel.centerX,
      top: challengePanel.bottom + 15
    } );

    // Layer when universal operation animation occurs
    var operationAnimationLayer = new Node();

    //TODO clicking in top/bottom areas of value is not working, was working in 1.0.0-dev.92
    // Universal Operation control
    var universalOperationControl = new UniversalOperationControl( scene, operationAnimationLayer, {
      centerX: scene.scale.location.x, // centered on the scale
      top: equationPanel.bottom + 10
    } );

    // Scale
    var scaleNode = new BalanceScaleNode( scene.scale, {
      organizeButtonVisible: false,
      clearScaleButtonVisible: false
    } );

    // Snapshots
    var snapshotsAccordionBox = new SnapshotsAccordionBox( scene, {
      fixedWidth: ( layoutBounds.right - scaleNode.right ) - EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN - 15,
      expandedProperty: this.snapshotsAccordionBoxExpandedProperty,
      right: layoutBounds.right - EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN,
      top: statusBar.bottom + 20
    } );

    // Refresh button, generates a new challenge, effectively skipping the current challenge
    var refreshButton = new RefreshButton( {
      iconScale: 0.6,
      xMargin: 14,
      yMargin: 7,
      right: challengePanel.right,
      centerY: challengePanel.centerY,
      listener: function() {
        scene.nextChallenge();

        //TODO temporarily register a correct answer
        scene.scoreProperty.value++;
        gameAudioPlayer.correctAnswer();
      }
    } );

    // Next button, takes us to the next challenge
    var nextButton = new RectangularPushButton( {
      visible: false, //TODO delete this when it's controlled by a listener
      content: new Text( nextString, {
        font: NEXT_BUTTON_FONT,
        maxWidth: 100 // determined empirically
      } ),
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      xMargin: 12,
      yMargin: 8,
      right: challengePanel.right,
      centerY: challengePanel.centerY,

      listener: function() {
        scene.nextChallenge();
      }
    } );

    // Smiley face, displayed when the challenge has been solved
    var faceNode = new FaceNode( 225, {
      visible: false, //TODO delete this when it's controlled by a listener
      opacity: 0.5,
      centerX: scaleNode.centerX,
      top: universalOperationControl.bottom + 25
    } );

    // terms live in this layer
    var termsLayer = new Node();

    var children = [
      statusBar,
      challengePanel,
      solveForXNode,
      equationPanel,
      scaleNode,
      snapshotsAccordionBox,
      refreshButton,
      nextButton,
      faceNode,
      universalOperationControl,
      termsLayer,
      operationAnimationLayer
    ];

    // show debugging info related to the challenge
    if ( EqualityExplorerQueryParameters.showAnswers ) {
      children.push( new DebugChallengeNode( scene.challengeProperty, {
        left: snapshotsAccordionBox.left,
        top: snapshotsAccordionBox.bottom + 25
      } ) );
    }

    assert && assert( !options.children, 'SolveItSceneNode sets children' );
    options.children = children;

    SceneNode.call( this, scene, sceneProperty, termsLayer, options );

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
            self.rewardNode = new EqualityExplorerRewardNode( scene.level );
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