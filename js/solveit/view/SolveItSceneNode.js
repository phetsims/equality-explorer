// Copyright 2018, University of Colorado Boulder

/**
 * Display a scene in the 'Solve It!' screen.  Each scene corresponds to a game level.
 * This shares several UI components with the Operations screen, but there are too many differences
 * to extend OperationsSceneNode.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Animation = require( 'TWIXT/Animation' );
  var BalanceScaleNode = require( 'EQUALITY_EXPLORER/common/view/BalanceScaleNode' );
  var ChallengeDerivationNode = require( 'EQUALITY_EXPLORER/solveit/view/ChallengeDerivationNode' );
  var Color = require( 'SCENERY/util/Color' );
  var Easing = require( 'TWIXT/Easing' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var EqualityExplorerRewardNode = require( 'EQUALITY_EXPLORER/solveit/view/EqualityExplorerRewardNode' );
  var EqualityExplorerSceneNode = require( 'EQUALITY_EXPLORER/common/view/EqualityExplorerSceneNode' );
  var EquationPanel = require( 'EQUALITY_EXPLORER/common/view/EquationPanel' );
  var FaceNode = require( 'SCENERY_PHET/FaceNode' );
  var InfiniteStatusBar = require( 'VEGAS/InfiniteStatusBar' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var RefreshButton = require( 'SCENERY_PHET/buttons/RefreshButton' );
  var RewardDialog = require( 'VEGAS/RewardDialog' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var SnapshotsAccordionBox = require( 'EQUALITY_EXPLORER/common/view/SnapshotsAccordionBox' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var UniversalOperationControl = require( 'EQUALITY_EXPLORER/common/view/UniversalOperationControl' );
  var Vector2 = require( 'DOT/Vector2' );

  // strings
  var nextString = require( 'string!EQUALITY_EXPLORER/next' );
  var solveForString = require( 'string!EQUALITY_EXPLORER/solveFor' );
  var xString = require( 'string!EQUALITY_EXPLORER/x' );

  // constants
  var LEVEL_FONT = new PhetFont( 20 );
  var NEXT_BUTTON_FONT = new PhetFont( 30 );
  var EQUATION_PANEL_OPTIONS = {
    contentWidth: 360,
    xMargin: 10,
    yMargin: 0
  };

  /**
   * @param {SolveItScene} scene - the scene associated with this Node
   * @param {Property.<SolveItScene|null>} sceneProperty - the selected scene
   * @param {Bounds2} layoutBounds - of the parent ScreenView
   * @param {Property.<Bounds2>} visibleBoundsProperty - of the parent ScreenView
   * @param {BooleanProperty} snapshotsAccordionBoxExpandedProperty - whether Snapshots is expanded
   * @param {GameAudioPlayer} gameAudioPlayer
   * @param {Object} [options]
   * @constructor
   */
  function SolveItSceneNode( scene, sceneProperty, layoutBounds, visibleBoundsProperty,
                             snapshotsAccordionBoxExpandedProperty, gameAudioPlayer, options ) {

    var self = this;

    options = options || {};

    // Level description, displayed in the status bar
    var levelDescriptionNode = new RichText( scene.description, {
      font: LEVEL_FONT,
      maxWidth: 650 // determined empirically
    } );

    var backButtonListener = function() {
      self.universalOperationControl.stopAnimations(); // stop any operations that are in progress
      sceneProperty.value = null; // back to the SettingsNode, where no scene is selected
    };

    // Bar across the top of the screen
    var statusBar = new InfiniteStatusBar( layoutBounds, visibleBoundsProperty, levelDescriptionNode,
      scene.scoreProperty, {
        floatToTop: true, // see https://github.com/phetsims/equality-explorer/issues/144
        spacing: 20,
        barFill: 'rgb( 252, 150, 152 )',
        backButtonListener: backButtonListener
      } );

    // Challenge equation
    var challengePanelOptions = _.extend( {}, EQUATION_PANEL_OPTIONS, {
      fill: Color.WHITE.withAlpha( 0.5 ),
      stroke: Color.BLACK.withAlpha( 0.5 ),
      equationNodeOptions: {
        relationalOperatorFontWeight: 'normal',
        updateEnabled: false // static equation, to display the challenge
      },
      centerX: scene.scale.location.x,
      top: statusBar.bottom + 15
    } );
    var challengePanel = new EquationPanel( scene.leftTermCreators, scene.rightTermCreators, challengePanelOptions );

    // Equation that reflects what is currently on the scale
    var equationPanel = new EquationPanel( scene.leftTermCreators, scene.rightTermCreators,
      _.extend( {}, EQUATION_PANEL_OPTIONS, {
        fill: 'white',
        stroke: 'black',
        equationNodeOptions: {
          relationalOperatorFontWeight: 'normal'
        },
        centerX: challengePanel.centerX,
        top: challengePanel.bottom + 10
      } ) );

    // 'Solve for x'
    var solveForXText = StringUtils.fillIn( solveForString, {
      variable: MathSymbolFont.getRichTextMarkup( xString )
    } );
    var solveForXNode = new RichText( solveForXText, {
      font: new PhetFont( { size: 24, weight: 'bold' } ),
      right: challengePanel.left - 10,
      centerY: challengePanel.centerY,
      maxWidth: challengePanel.left - layoutBounds.minX - EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN
    } );

    // Layer when universal operation animation occurs
    var operationAnimationLayer = new Node();

    // @private Universal Operation control
    this.universalOperationControl = new UniversalOperationControl( scene, operationAnimationLayer, {
      timesZeroEnabled: false, // disable multiplication by zero, see phetsims/equality-explorer#72
      centerX: scene.scale.location.x, // centered on the scale
      top: equationPanel.bottom + 15
    } );

    // Scale
    var scaleNode = new BalanceScaleNode( scene.scale, {
      clearScaleButtonVisible: false,
      organizeButtonVisible: false,
      disposeTermsNotOnScale: scene.disposeTermsNotOnScale.bind( scene )
    } );

    // Snapshots
    var snapshotsAccordionBox = new SnapshotsAccordionBox( scene, {
      fixedWidth: ( layoutBounds.right - scaleNode.right ) - EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN - 15,
      expandedProperty: snapshotsAccordionBoxExpandedProperty,
      right: layoutBounds.right - EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN,
      top: statusBar.bottom + 20
    } );

    // Refresh button, generates a new challenge, effectively skipping the current challenge
    var refreshButton = new RefreshButton( {
      iconScale: 0.6,
      xMargin: 14,
      yMargin: 7,
      left: challengePanel.right + 10,
      centerY: challengePanel.centerY,
      listener: function() {
        phet.log && phet.log( 'Refresh button pressed' );
        scene.nextChallenge();
      }
    } );

    // Next button, takes us to the next challenge
    var nextButton = new RectangularPushButton( {
      content: new Text( nextString, {
        font: NEXT_BUTTON_FONT,
        maxWidth: 100 // determined empirically
      } ),
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      xMargin: 12,
      yMargin: 8,
      centerX: scene.scale.location.x,
      top: this.universalOperationControl.bottom + 30, // determined empirically
      listener: function() {
        phet.log && phet.log( 'Next button pressed' );
        scene.nextChallenge();
      }
    } );

    // Smiley face, displayed when the challenge has been solved
    var faceNode = new FaceNode( 225, {
      centerX: scaleNode.centerX,
      top: this.universalOperationControl.bottom + 25
    } );

    // terms live in this layer
    var termsLayer = new Node( {
      pickable: false // terms are not interactive, all interaction is with the universal operation control
    } );

    var children = [
      statusBar,
      challengePanel,
      solveForXNode,
      equationPanel,
      scaleNode,
      snapshotsAccordionBox,
      refreshButton,
      nextButton,
      this.universalOperationControl,
      termsLayer, // terms in from of all of the above
      operationAnimationLayer, // operations in front of terms
      faceNode // face in front of everything
    ];

    if ( phet.chipper.queryParameters.showAnswers ) {

      // shows how the current challenge was derived
      children.push( new ChallengeDerivationNode( scene.challengeProperty, {
        left: snapshotsAccordionBox.left,
        top: snapshotsAccordionBox.bottom + 5
      } ) );

      // button that takes you directly to the answer. debug only, i18n not needed.
      var showAnswerButton = new RectangularPushButton( {
        content: new Text( 'show answer', {
          font: new PhetFont( 16 ),
          fill: 'white'
        } ),
        baseColor: 'red',
        centerX: scaleNode.centerX,
        bottom: scaleNode.bottom - 5,
        listener: function() {
          scene.showAnswer();
        }
      } );
      children.push( showAnswerButton );
    }

    assert && assert( !options.children, 'SolveItSceneNode sets children' );
    options.children = children;

    EqualityExplorerSceneNode.call( this, scene, sceneProperty, termsLayer, options );

    // {RewardDialog} dialog that is displayed when we reach GAME_REWARD_SCORE correct answers.
    // Created on demand and reused, so we don't have to deal with buggy Dialog.dispose.
    var rewardDialog = null;

    // @private {EqualityExplorerRewardNode} reward shown while rewardDialog is open
    this.rewardNode = null;

    // Property that controls opacity of smiley face
    var faceOpacityProperty = new NumberProperty( faceNode.opacity );
    faceOpacityProperty.link( function( faceOpacity ) {
      faceNode.opacity = faceOpacity;
    } );

    // @private
    this.faceAnimation = null;

    // unlink not needed.
    scene.scoreProperty.lazyLink( function( score, oldScore ) {

      // do nothing when the score is reset
      if ( score < oldScore ) {
        return;
      }

      refreshButton.visible = false;
      showAnswerButton && ( showAnswerButton.visible = false );

      // When the score reaches a magic number, display the reward.
      if ( score === EqualityExplorerQueryParameters.rewardScore ) {

        gameAudioPlayer.gameOverPerfectScore();

        nextButton.visible = true;

        // show the reward dialog
        rewardDialog = rewardDialog || new RewardDialog( scene.scoreProperty.value, {

          // Display the dialog in a location that does not obscure the challenge solution.
          // See https://github.com/phetsims/equality-explorer/issues/104
          layoutStrategy: function( dialog, simBounds, screenBounds, scale ) {

            // center horizontally on the screen
            var screenCenterX = screenBounds.center.times( 1 / scale ).x;

            // top of dialog below equationPanel, so the solution is not obscured
            var localCenterTop = new Vector2( equationPanel.centerX, equationPanel.bottom + 10 );
            var globalCenterTop = self.localToGlobalPoint( localCenterTop ).times( 1 / scale );

            dialog.centerX = screenCenterX;
            dialog.top = globalCenterTop.y;
          },

          // 'Keep Going' hides the dialog
          keepGoingButtonListener: function() {
            rewardDialog.hide();
          },

          // 'New Level' has the same effect as the back button in the status bar
          newLevelButtonListener: function() {
            rewardDialog.hide();
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
        rewardDialog.show();
      }
      else {

        // ding!
        gameAudioPlayer.correctAnswer();

        // Show smiley face, fade it out, then show the Next button.
        faceOpacityProperty.value = 0.8;
        faceNode.visible = true;

        self.faceAnimation = new Animation( {
          animationStepEmitter: null, // via step function
          delay: 1,
          duration: 0.8,
          targets: [ {
            property: faceOpacityProperty,
            easing: Easing.LINEAR,
            to: 0
          } ]
        } );

        // removeListener not needed
        self.faceAnimation.finishEmitter.addListener( function() {
          faceNode.visible = false;
          nextButton.visible = true;
          self.faceAnimation = null;
        } );

        self.faceAnimation.start();
      }
    } );

    // When the challenge changes... unlink not needed.
    scene.challengeProperty.link( function( challenge ) {

      // cancel operation animations
      self.universalOperationControl.reset();

      // display the challenge equation
      self.removeChild( challengePanel );
      challengePanel = new EquationPanel( scene.leftTermCreators, scene.rightTermCreators, challengePanelOptions );
      self.addChild( challengePanel );
      challengePanel.moveToBack();

      // visibility of other UI elements
      refreshButton.visible = true;
      nextButton.visible = false;
      faceNode.visible = false;
      showAnswerButton && ( showAnswerButton.visible = true );
    } );

    // Perform sum-to-zero animation for any terms that became zero as the result of a universal operation.
    // removeListener not needed.
    scene.sumToZeroEmitter.addListener( this.animateSumToZero.bind( this ) );
  }

  equalityExplorer.register( 'SolveItSceneNode', SolveItSceneNode );

  return inherit( EqualityExplorerSceneNode, SolveItSceneNode, {

    // @public
    reset: function() {
      this.universalOperationControl.reset();
    },

    /**
     * @param {number} dt - elapsed time, in seconds
     * @public
     */
    step: function( dt ) {
      this.universalOperationControl.step( dt );
      this.faceAnimation && this.faceAnimation.step( dt );
      this.rewardNode && this.rewardNode.step( dt );
    }
  } );
} );