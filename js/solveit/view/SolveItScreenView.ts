// Copyright 2018-2022, University of Colorado Boulder

/**
 * View for the 'Solve It!' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import { Node } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Easing from '../../../../twixt/js/Easing.js';
import TransitionNode from '../../../../twixt/js/TransitionNode.js';
import GameAudioPlayer from '../../../../vegas/js/GameAudioPlayer.js';
import EqualityExplorerConstants from '../../common/EqualityExplorerConstants.js';
import equalityExplorer from '../../equalityExplorer.js';
import SolveItModel from '../model/SolveItModel.js';
import SolveItLevelSelectionNode from './SolveItLevelSelectionNode.js';
import SolveItLevelNode from './SolveItLevelNode.js';

// constants
const TRANSITION_OPTIONS = {
  duration: 0.5, // sec
  targetOptions: {
    easing: Easing.QUADRATIC_IN_OUT
  }
};

export default class SolveItScreenView extends ScreenView {

  // State of the Snapshots accordion box is global to the Screen. Expanding it in one game level expands it in
  // all game levels. See https://github.com/phetsims/equality-explorer/issues/124
  private readonly snapshotsAccordionBoxExpandedProperty: Property<boolean>;

  // a Node for each level of the game
  private readonly levelNodes: SolveItLevelNode[];

  // Handles the animated 'slide' transition between level-selection and game levels
  private readonly transitionNode: TransitionNode;

  public constructor( model: SolveItModel, tandem: Tandem ) {

    const options = {
      layoutBounds: EqualityExplorerConstants.SCREEN_VIEW_LAYOUT_BOUNDS,
      preventFit: EqualityExplorerConstants.SCREEN_VIEW_PREVENT_FIT,
      tandem: tandem
    };

    super( options );

    this.snapshotsAccordionBoxExpandedProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'snapshotsAccordionBoxExpandedProperty' ),
      phetioDocumentation: 'applies to the "Snapshots" accordion box for all game levels'
    } );

    const gameAudioPlayer = new GameAudioPlayer();

    // UI for level selection and other game settings
    const levelSelectionNode = new SolveItLevelSelectionNode( model, this.layoutBounds, {
      resetCallback: () => {
        model.reset();
        this.reset();
      },
      tandem: options.tandem.createTandem( 'levelSelectionNode' )
    } );

    // Nodes for levels, organized under a parent tandem
    const levelNodesTandem = options.tandem.createTandem( 'levelNodes' );
    this.levelNodes = model.levels.map( level => new SolveItLevelNode( level, model.levelProperty,
      this.layoutBounds, this.visibleBoundsProperty, this.snapshotsAccordionBoxExpandedProperty, gameAudioPlayer, {
        visibleProperty: new DerivedProperty( [ model.levelProperty ], selectedLevel => ( level === selectedLevel ) ),
        tandem: levelNodesTandem.createTandem( `${level.tandem.name}Node` )
      } ) );
    const levelsParent = new Node( {
      children: this.levelNodes
    } );

    // Transition (slide left/right) between level-selection UI and the selected game level.
    this.transitionNode = new TransitionNode( this.visibleBoundsProperty, {
      cachedNodes: [ levelSelectionNode, levelsParent ]
    } );
    this.addChild( this.transitionNode );

    //TODO handle the case where phet-io switches directly between 2 levels
    model.levelProperty.link( level => {

      // If the selected level doesn't have an associated challenge, create one.
      if ( level !== null && !level.challengeProperty.value ) {
        level.nextChallenge();
      }

      // Start the transition between the level-selection UI and the selected game level.
      if ( level !== null ) {
        this.transitionNode.slideLeftTo( levelsParent, TRANSITION_OPTIONS );
      }
      else {
        this.transitionNode.slideRightTo( levelSelectionNode, TRANSITION_OPTIONS );
      }
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public reset(): void {
    this.snapshotsAccordionBoxExpandedProperty.reset();
    for ( let i = 0; i < this.levelNodes.length; i++ ) {
      this.levelNodes[ i ].reset();
    }
  }

  /**
   * @param dt - elapsed time, in seconds
   */
  public override step( dt: number ): void {

    super.step( dt );

    // animate the transition between level-selection and challenge UI
    this.transitionNode.step( dt );

    // animate the view for the selected level
    for ( let i = 0; i < this.levelNodes.length; i++ ) {
      const levelNode = this.levelNodes[ i ];
      if ( levelNode.visible ) {
        levelNode.step && levelNode.step( dt );
        break;
      }
    }
  }
}

equalityExplorer.register( 'SolveItScreenView', SolveItScreenView );