// Copyright 2018-2022, University of Colorado Boulder

/**
 * View for the 'Solve It!' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import merge from '../../../../phet-core/js/merge.js';
import { Node } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Easing from '../../../../twixt/js/Easing.js';
import TransitionNode from '../../../../twixt/js/TransitionNode.js';
import GameAudioPlayer from '../../../../vegas/js/GameAudioPlayer.js';
import EqualityExplorerConstants from '../../common/EqualityExplorerConstants.js';
import equalityExplorer from '../../equalityExplorer.js';
import SolveItModel from '../model/SolveItModel.js';
import SolveItLevelSelectionNode from './SolveItLevelSelectionNode.js';
import SolveItSceneNode from './SolveItSceneNode.js';

// constants
const TRANSITION_OPTIONS = {
  duration: 0.5, // sec
  targetOptions: {
    easing: Easing.QUADRATIC_IN_OUT
  }
};

class SolveItScreenView extends ScreenView {

  /**
   * @param {SolveItModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {
    assert && assert( model instanceof SolveItModel );
    assert && assert( tandem instanceof Tandem );

    const options = merge( {
      tandem: tandem
    }, EqualityExplorerConstants.SCREEN_VIEW_OPTIONS );

    super( options );

    // @private state of the Snapshots accordion box is global to the Screen,
    // see https://github.com/phetsims/equality-explorer/issues/124
    this.snapshotsAccordionBoxExpandedProperty =
      new BooleanProperty( EqualityExplorerConstants.SNAPSHOTS_ACCORDION_BOX_EXPANDED );

    const gameAudioPlayer = new GameAudioPlayer();

    // UI for level selection and other game settings
    const levelSelectionNode = new SolveItLevelSelectionNode( model, this.layoutBounds, {
      resetCallback: () => {
        model.reset();
        this.reset();
      }
    } );

    // @private {SolveItSceneNode[]} a scene for each level of the game
    this.sceneNodes = [];
    for ( let i = 0; i < model.scenes.length; i++ ) {
      const sceneNode = new SolveItSceneNode( model.scenes[ i ], model.sceneProperty,
        this.layoutBounds, this.visibleBoundsProperty, this.snapshotsAccordionBoxExpandedProperty, gameAudioPlayer );
      this.sceneNodes.push( sceneNode );
    }
    const scenesParent = new Node( {
      children: this.sceneNodes
    } );

    // Handles the animated 'slide' transition between level-selection and challenges (scenesParent)
    this.transitionNode = new TransitionNode( this.visibleBoundsProperty, {
      content: ( model.sceneProperty.value === null ) ? levelSelectionNode : scenesParent,
      cachedNodes: [ scenesParent ]
    } );
    this.addChild( this.transitionNode );

    // Make the selected scene (level) visible. unlink not needed.
    model.sceneProperty.link( scene => {

      // Skip null (no scene selected), so that scene is shown during 'slide' transition
      if ( scene !== null ) {

        // if the scene doesn't have an associated challenge, create one
        if ( !scene.challengeProperty.value ) {
          scene.nextChallenge();
        }

        // make the selected scene visible
        for ( let i = 0; i < this.sceneNodes.length; i++ ) {
          this.sceneNodes[ i ].visible = ( this.sceneNodes[ i ].scene === scene );
        }
      }
    } );

    // Transition between the level-selection UI and the selected scene.
    model.sceneProperty.lazyLink( scene => {
      if ( scene ) {
        this.transitionNode.slideLeftTo( scenesParent, TRANSITION_OPTIONS );
      }
      else {
        this.transitionNode.slideRightTo( levelSelectionNode, TRANSITION_OPTIONS );
      }
    } );
  }

  // @public
  reset() {
    this.snapshotsAccordionBoxExpandedProperty.reset();
    for ( let i = 0; i < this.sceneNodes.length; i++ ) {
      this.sceneNodes[ i ].reset();
    }
  }

  /**
   * @param {number} dt - elapsed time, in seconds
   * @public
   */
  step( dt ) {

    // animate the transition between level-selection and challenge UI
    this.transitionNode.step( dt );

    // animate the view for the selected scene
    for ( let i = 0; i < this.sceneNodes.length; i++ ) {
      const sceneNode = this.sceneNodes[ i ];
      if ( sceneNode.visible ) {
        sceneNode.step && sceneNode.step( dt );
        break;
      }
    }
  }
}

equalityExplorer.register( 'SolveItScreenView', SolveItScreenView );

export default SolveItScreenView;