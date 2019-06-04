// Copyright 2018, University of Colorado Boulder

/**
 * View for the 'Solve It!' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var Easing = require( 'TWIXT/Easing' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var GameAudioPlayerOld = require( 'VEGAS/GameAudioPlayerOld' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LevelSelectionNode = require( 'EQUALITY_EXPLORER/solveit/view/LevelSelectionNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SolveItSceneNode = require( 'EQUALITY_EXPLORER/solveit/view/SolveItSceneNode' );
  var TransitionNode = require( 'TWIXT/TransitionNode' );

  // constants
  var TRANSITION_OPTIONS = {
    duration: 0.5, // sec
    targetOptions: {
      easing: Easing.QUADRATIC_IN_OUT
    }
  };

  /**
   * @param {SolveItModel} model
   * @constructor
   */
  function SolveItScreenView( model ) {

    var self = this;

    ScreenView.call( this, model );

    // @private state of the Snapshots accordion box is global to the Screen,
    // see https://github.com/phetsims/equality-explorer/issues/124
    this.snapshotsAccordionBoxExpandedProperty =
      new BooleanProperty( EqualityExplorerConstants.SNAPSHOTS_ACCORDION_BOX_EXPANDED );

    var gameAudioPlayer = new GameAudioPlayerOld( model.soundEnabledProperty );

    // UI for level selection and other game settings
    var levelSelectionNode = new LevelSelectionNode( model, this.layoutBounds, {
      resetCallback: function() {
        model.reset();
        self.reset();
      }
    } );

    // @private {SolveItSceneNode[]} a scene for each level of the game
    this.sceneNodes = [];
    for ( var i = 0; i < model.scenes.length; i++ ) {
      var sceneNode = new SolveItSceneNode( model.scenes[ i ], model.sceneProperty,
        this.layoutBounds, this.visibleBoundsProperty, this.snapshotsAccordionBoxExpandedProperty, gameAudioPlayer );
      this.sceneNodes.push( sceneNode );
    }
    var scenesParent = new Node( {
      children: this.sceneNodes
    } );

    // Handles the animated 'slide' transition between level-selection and challenges (scenesParent)
    this.transitionNode = new TransitionNode( this.visibleBoundsProperty, {
      content: ( model.sceneProperty.value === null ) ? levelSelectionNode : scenesParent,
      cachedNodes: [ scenesParent ]
    } );
    this.addChild( this.transitionNode );

    // Make the selected scene (level) visible. unlink not needed.
    model.sceneProperty.link( function( scene ) {

      // Skip null (no scene selected), so that scene is shown during 'slide' transition
      if ( scene !== null ) {

        // if the scene doesn't have an associated challenge, create one
        if ( !scene.challengeProperty.value ) {
          scene.nextChallenge();
        }

        // make the selected scene visible
        for ( var i = 0; i < self.sceneNodes.length; i++ ) {
          self.sceneNodes[ i ].visible = ( self.sceneNodes[ i ].scene === scene );
        }
      }
    } );

    // Transition between the level-selection UI and the selected scene.
    model.sceneProperty.lazyLink( function( scene ) {
      if ( scene ) {
        self.transitionNode.slideLeftTo( scenesParent, TRANSITION_OPTIONS );
      }
      else {
        self.transitionNode.slideRightTo( levelSelectionNode, TRANSITION_OPTIONS );
      }
    } );
  }

  equalityExplorer.register( 'SolveItScreenView', SolveItScreenView );

  return inherit( ScreenView, SolveItScreenView, {

    // @public
    reset: function() {
      this.snapshotsAccordionBoxExpandedProperty.reset();
      for ( var i = 0; i < this.sceneNodes.length; i++ ) {
        this.sceneNodes[ i ].reset();
      }
    },

    /**
     * @param {number} dt - elapsed time, in seconds
     * @public
     */
    step: function( dt ) {

      // animate the transition between level-selection and challenge UI
      this.transitionNode.step( dt );

      // animate the view for the selected scene
      for ( var i = 0; i < this.sceneNodes.length; i++ ) {
        var sceneNode = this.sceneNodes[ i ];
        if ( sceneNode.visible ) {
          sceneNode.step && sceneNode.step( dt );
          break;
        }
      }
    }
  } );
} );