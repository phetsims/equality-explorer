// Copyright 2018-2022, University of Colorado Boulder

//TODO rename SolveItLevelNode
/**
 * Display a scene in the 'Solve It!' screen.  Each scene corresponds to a game level.
 * This shares several UI components with the Operations screen, but there are too many differences
 * to extend OperationsSceneNode.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import RefreshButton from '../../../../scenery-phet/js/buttons/RefreshButton.js';
import FaceNode from '../../../../scenery-phet/js/FaceNode.js';
import MathSymbolFont from '../../../../scenery-phet/js/MathSymbolFont.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Color, Node, RichText, Text } from '../../../../scenery/js/imports.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import GameAudioPlayer from '../../../../vegas/js/GameAudioPlayer.js';
import InfiniteStatusBar from '../../../../vegas/js/InfiniteStatusBar.js';
import RewardDialog from '../../../../vegas/js/RewardDialog.js';
import EqualityExplorerConstants from '../../common/EqualityExplorerConstants.js';
import EqualityExplorerQueryParameters from '../../common/EqualityExplorerQueryParameters.js';
import BalanceScaleNode from '../../common/view/BalanceScaleNode.js';
import EqualityExplorerSceneNode, { EqualityExplorerSceneNodeOptions } from '../../common/view/EqualityExplorerSceneNode.js';
import EquationPanel, { EquationPanelOptions } from '../../common/view/EquationPanel.js';
import SnapshotsAccordionBox from '../../common/view/SnapshotsAccordionBox.js';
import UniversalOperationControl from '../../common/view/UniversalOperationControl.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerStrings from '../../EqualityExplorerStrings.js';
import SolveItLevel from '../model/SolveItLevel.js';
import ChallengeDerivationText from './ChallengeDerivationText.js';
import SolveItRewardNode from './SolveItRewardNode.js';
import SumToZeroNode from '../../common/view/SumToZeroNode.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';

// constants
const LEVEL_FONT = new PhetFont( 20 );
const NEXT_BUTTON_FONT = new PhetFont( 30 );
const EQUATION_PANEL_OPTIONS = {
  contentWidth: 360,
  xMargin: 10,
  yMargin: 0
};

type SelfOptions = EmptySelfOptions;

type SolveItSceneNodeOptions = SelfOptions &
  PickRequired<EqualityExplorerSceneNodeOptions, 'tandem' | 'visibleProperty'>;

export default class SolveItSceneNode extends EqualityExplorerSceneNode {

  // animation that fades out the smiley face
  private faceAnimation: Animation | null;

  // reward shown while rewardDialog is open
  private rewardNode: SolveItRewardNode | null;

  // control for applying a universal operation to the terms that are on the scale
  private readonly universalOperationControl: UniversalOperationControl;

  public constructor( scene: SolveItLevel,
                      sceneProperty: Property<SolveItLevel | null>,
                      layoutBounds: Bounds2,
                      visibleBoundsProperty: TReadOnlyProperty<Bounds2>,
                      snapshotsAccordionBoxExpandedProperty: Property<boolean>,
                      gameAudioPlayer: GameAudioPlayer,
                      providedOptions: SolveItSceneNodeOptions ) {

    const options = optionize<SolveItSceneNodeOptions, SelfOptions, EqualityExplorerSceneNodeOptions>()( {
      // empty optionize because we're setting options.children below
    }, providedOptions );

    const statusBarTandem = options.tandem.createTandem( 'statusBar' );

    // Level description, displayed in the status bar
    const levelDescriptionText = new RichText( scene.challengeGenerator.descriptionProperty, {
      font: LEVEL_FONT,
      maxWidth: 650, // determined empirically
      tandem: statusBarTandem.createTandem( 'levelDescriptionText' )
    } );

    const backButtonListener = () => {
      universalOperationControl.stopAnimations(); // stop any operations that are in progress
      sceneProperty.value = null; // back to the SettingsNode, where no scene is selected
    };

    // Bar across the top of the screen
    const statusBar = new InfiniteStatusBar( layoutBounds, visibleBoundsProperty, levelDescriptionText,
      scene.scoreProperty, {
        floatToTop: true, // see https://github.com/phetsims/equality-explorer/issues/144
        spacing: 20,
        barFill: 'rgb( 252, 150, 152 )',
        backButtonListener: backButtonListener,
        tandem: statusBarTandem,
        phetioVisiblePropertyInstrumented: false
      } );

    // Challenge equation
    const challengePanelOptions = combineOptions<EquationPanelOptions>( {}, EQUATION_PANEL_OPTIONS, {
      fill: Color.WHITE.withAlpha( 0.5 ),
      stroke: Color.BLACK.withAlpha( 0.5 ),
      equationNodeOptions: {
        relationalOperatorFontWeight: 'normal',
        updateEnabled: false // static equation, to display the challenge
      },
      centerX: scene.scale.position.x,
      top: statusBar.bottom + 15
    } );

    // A new EquationPanel instance is created for each challenge. Since it's not necessary to instrument any
    // of EquationPanel's subcomponents in this screen, wrap it in a static Node that will be its proxy in the
    // Studio tree.
    const challengeEquationNode = new Node( {
      children: [ new EquationPanel( scene.leftTermCreators, scene.rightTermCreators, challengePanelOptions ) ],
      tandem: options.tandem.createTandem( 'challengeEquationNode' ),
      phetioDocumentation: 'Displays the equation for the current game challenge.'
    } );

    // Equation that reflects what is currently on the balance scale
    const balanceScaleEquationNode = new EquationPanel( scene.leftTermCreators, scene.rightTermCreators,
      combineOptions<EquationPanelOptions>( {}, EQUATION_PANEL_OPTIONS, {
        fill: 'white',
        stroke: 'black',
        equationNodeOptions: {
          relationalOperatorFontWeight: 'normal'
        },
        centerX: challengeEquationNode.centerX,
        top: challengeEquationNode.bottom + 10,
        tandem: options.tandem.createTandem( 'balanceScaleEquationNode' ),
        phetioDocumentation: 'Displays the equation that matches what is currently on the balance scale.'
      } ) );

    // Layer when universal operation animation occurs
    const operationAnimationLayer = new Node();

    // Universal Operation control
    const universalOperationControl = new UniversalOperationControl( scene, operationAnimationLayer, {
      timesZeroEnabled: false, // disable multiplication by zero, see phetsims/equality-explorer#72
      centerX: scene.scale.position.x, // centered on the scale
      top: balanceScaleEquationNode.bottom + 15,
      tandem: options.tandem.createTandem( 'universalOperationControl' )
    } );

    // 'Solve for x'
    const solveForXTextTandem = options.tandem.createTandem( 'solveForXText' );
    const solveForXStringProperty = new DerivedProperty(
      [ EqualityExplorerStrings.solveForStringProperty, EqualityExplorerStrings.xStringProperty ],
      ( solveForString, xString ) => StringUtils.fillIn( solveForString, {
        variable: MathSymbolFont.getRichTextMarkup( xString )
      } ), {
        tandem: solveForXTextTandem.createTandem( RichText.STRING_PROPERTY_TANDEM_NAME ),
        phetioValueType: StringIO
      } );
    const solveForXText = new RichText( solveForXStringProperty, {
      font: new PhetFont( { size: 24, weight: 'bold' } ),
      maxWidth: challengeEquationNode.left - layoutBounds.minX - EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN,
      tandem: solveForXTextTandem
    } );
    solveForXText.boundsProperty.link( bounds => {
      solveForXText.right = challengeEquationNode.left - 10;
      solveForXText.centerY = challengeEquationNode.centerY;
    } );

    // Scale
    const balanceScaleNode = new BalanceScaleNode( scene.scale, {
      clearScaleButtonVisible: false,
      organizeButtonVisible: false,
      disposeTermsNotOnScale: scene.disposeTermsNotOnScale.bind( scene )
      // No PhET-iO instrumentation
    } );

    // Snapshots
    const snapshotsAccordionBox = new SnapshotsAccordionBox( scene, {
      fixedWidth: ( layoutBounds.right - balanceScaleNode.right ) - EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN - 15,
      expandedProperty: snapshotsAccordionBoxExpandedProperty,
      right: layoutBounds.right - EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN,
      top: statusBar.bottom + 20,
      tandem: options.tandem.createTandem( 'snapshotsAccordionBox' )
    } );

    // Refresh button, generates a new challenge, effectively skipping the current challenge
    const refreshButton = new RefreshButton( {
      iconHeight: 23,
      xMargin: 14,
      yMargin: 7,
      left: challengeEquationNode.right + 10,
      centerY: challengeEquationNode.centerY,
      listener: () => {
        phet.log && phet.log( 'Refresh button pressed' );
        scene.nextChallenge();
      },
      tandem: options.tandem.createTandem( 'refreshButton' ),
      phetioDocumentation: 'This button generates a new challenge.'
    } );

    // Next button, takes us to the next challenge
    const nextButton = new RectangularPushButton( {
      content: new Text( EqualityExplorerStrings.nextStringProperty, {
        font: NEXT_BUTTON_FONT,
        maxWidth: 100 // determined empirically
      } ),
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      xMargin: 12,
      yMargin: 8,
      centerX: scene.scale.position.x,
      top: universalOperationControl.bottom + 30, // determined empirically
      listener: () => {
        phet.log && phet.log( 'Next button pressed' );
        scene.nextChallenge();
      },
      tandem: options.tandem.createTandem( 'nextButton' ),
      phetioDocumentation: 'This button appears when the current challenge has been solved. Pressing it advances to a new challenge.',
      visiblePropertyOptions: { phetioReadOnly: true } // so that PhET-iO client can see whether its visible
    } );

    // Smiley face, displayed when the challenge has been solved
    const faceNode = new FaceNode( 225, {
      centerX: balanceScaleNode.centerX,
      top: universalOperationControl.bottom + 25,
      tandem: options.tandem.createTandem( 'faceNode' ),
      visiblePropertyOptions: { phetioReadOnly: true } // so that PhET-iO client can see whether its visible
    } );

    // terms live in this layer
    const termsLayer = new Node( {
      pickable: false // terms are not interactive, all interaction is with the universal operation control
    } );

    const children = [
      statusBar,
      challengeEquationNode,
      solveForXText,
      balanceScaleEquationNode,
      balanceScaleNode,
      snapshotsAccordionBox,
      refreshButton,
      nextButton,
      universalOperationControl,
      termsLayer, // terms in from of all of the above
      operationAnimationLayer, // operations in front of terms
      faceNode // face in front of everything
    ];

    let showAnswerButton: Node;
    if ( phet.chipper.queryParameters.showAnswers ) {

      // shows how the current challenge was derived
      children.push( new ChallengeDerivationText( scene.challengeProperty, {
        left: snapshotsAccordionBox.left,
        top: snapshotsAccordionBox.bottom + 5
      } ) );

      // button that takes you directly to the answer. debug only, i18n not needed.
      showAnswerButton = new RectangularPushButton( {
        content: new Text( 'show answer', {
          font: new PhetFont( 16 ),
          fill: 'white'
        } ),
        baseColor: 'red',
        centerX: balanceScaleNode.centerX,
        bottom: balanceScaleNode.bottom - 5,
        listener: () => {
          scene.showAnswer();
        }
      } );
      children.push( showAnswerButton );
    }

    assert && assert( !options.children, 'SolveItSceneNode sets children' );
    options.children = children;

    super( scene, snapshotsAccordionBox, termsLayer, options );

    this.universalOperationControl = universalOperationControl;

    // Dialog that is displayed when we reach GAME_REWARD_SCORE correct answers.
    // Created on demand and reused, so we don't have to deal with buggy Dialog.dispose.
    let rewardDialog: RewardDialog | null = null;
    this.rewardNode = null;

    // Property that controls opacity of smiley face
    const faceOpacityProperty = new NumberProperty( faceNode.opacity );
    faceOpacityProperty.link( faceOpacity => {
      faceNode.opacity = faceOpacity;
    } );

    this.faceAnimation = null;

    // unlink not needed.
    scene.scoreProperty.lazyLink( ( score, oldScore ) => {

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

          // Display the dialog in a position that does not obscure the challenge solution.
          // See https://github.com/phetsims/equality-explorer/issues/104
          layoutStrategy: ( dialog, simBounds, screenBounds, scale ) => {

            // center horizontally on the screen
            const dialogLayoutBounds = dialog.layoutBounds!;
            assert && assert( dialogLayoutBounds );
            dialog.centerX = dialogLayoutBounds.centerX;

            // top of dialog below balanceScaleEquationNode, so the solution is not obscured
            dialog.top = balanceScaleEquationNode.bottom + 10;
          },

          // 'Keep Going' hides the dialog
          keepGoingButtonListener: () => rewardDialog!.hide(),

          // 'New Level' has the same effect as the back button in the status bar
          newLevelButtonListener: () => {
            rewardDialog!.hide();
            backButtonListener();
          },

          // When the dialog is shown, show the reward
          showCallback: () => {
            assert && assert( !this.rewardNode, 'rewardNode is not supposed to exist' );
            this.rewardNode = new SolveItRewardNode( scene.challengeGenerator.level );
            this.addChild( this.rewardNode );
          },

          // When the dialog is hidden, dispose of the reward
          hideCallback: () => {
            const rewardNode = this.rewardNode!;
            assert && assert( rewardNode, 'rewardNode is supposed to exist' );
            this.removeChild( rewardNode );
            rewardNode.dispose();
            this.rewardNode = null;
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

        this.faceAnimation = new Animation( {
          stepEmitter: null, // via step function
          delay: 1,
          duration: 0.8,
          targets: [ {
            property: faceOpacityProperty,
            easing: Easing.LINEAR,
            to: 0
          } ]
        } );

        // removeListener not needed
        this.faceAnimation.finishEmitter.addListener( () => {
          faceNode.visible = false;
          nextButton.visible = true;
          this.faceAnimation = null;
        } );

        this.faceAnimation.start();
      }
    } );

    // When the challenge changes... unlink not needed.
    scene.challengeProperty.link( challenge => {

      // cancel operation animations
      this.universalOperationControl.reset();

      // display the challenge equation
      challengeEquationNode.children = [
        new EquationPanel( scene.leftTermCreators, scene.rightTermCreators, challengePanelOptions )
      ];

      // visibility of other UI elements
      refreshButton.visible = true;
      nextButton.visible = false;
      faceNode.visible = false;
      showAnswerButton && ( showAnswerButton.visible = true );
    } );

    // Perform sum-to-zero animation for any terms that became zero as the result of a universal operation.
    // removeListener not needed.
    scene.sumToZeroEmitter.addListener( termCreators => SumToZeroNode.animateSumToZero( termCreators, this.termsLayer ) );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public override reset(): void {
    this.universalOperationControl.reset();
    super.reset();
  }

  /**
   * @param dt - elapsed time, in seconds
   */
  public override step( dt: number ): void {
    this.universalOperationControl.step( dt );
    this.faceAnimation && this.faceAnimation.step( dt );
    this.rewardNode && this.rewardNode.step( dt );
    super.step( dt );
  }
}

equalityExplorer.register( 'SolveItSceneNode', SolveItSceneNode );