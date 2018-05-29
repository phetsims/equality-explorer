// Copyright 2018, University of Colorado Boulder

/**
 * View for the 'Solve It!' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Easing = require( 'TWIXT/Easing' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var GameAudioPlayer = require( 'VEGAS/GameAudioPlayer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LevelSelectionNode = require( 'EQUALITY_EXPLORER/solveit/view/LevelSelectionNode' );
  var Property = require( 'AXON/Property' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SolveItSceneNode = require( 'EQUALITY_EXPLORER/solveit/view/SolveItSceneNode' );
  var TransitionNode = require( 'TWIXT/TransitionNode' );

  // constants
  var TRANSITION_OPTIONS = {
    duration: 0.4, // sec
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

    var gameAudioPlayer = new GameAudioPlayer( model.soundEnabledProperty );

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
        this.layoutBounds, this.visibleBoundsProperty, gameAudioPlayer );
      this.sceneNodes.push( sceneNode );
    }

    // {Property.<SolveItSceneNode|null>} Node for the scene that is currently selected, null when no scene is selected
    var selectedSceneNodeProperty = new Property( null );

    // Handles the animated 'slide' transition between level-selection and selected scene
    assert && assert( model.sceneProperty.value === null, 'expected to start with level-selection UI' );
    this.transitionNode = new TransitionNode( this.visibleBoundsProperty, {
      content: levelSelectionNode
    } );
    this.addChild( this.transitionNode );

    model.sceneProperty.link( function( scene ) {

      if ( scene === null ) {

        // no scene is selected
        selectedSceneNodeProperty.value = null;
      }
      else {

        // if the selected scene doesn't have an associated challenge, create one
        if ( !scene.challengeProperty.value ) {
          scene.nextChallenge();
        }

        // locate the Node for the selected scene
        for ( var i = 0; i < self.sceneNodes.length; i++ ) {
          if ( self.sceneNodes[ i ].scene === scene ) {
            selectedSceneNodeProperty.value = self.sceneNodes[ i ];
            break;
          }
        }
        assert && assert( selectedSceneNodeProperty.value, 'Node not found for selected scene' );
      }
    } );

    // When there is no scene selection, show the level-selection UI.
    selectedSceneNodeProperty.lazyLink( function( selectedSceneNode ) {
      if ( selectedSceneNode === null ) {
        self.transitionNode.slideRightTo( levelSelectionNode, TRANSITION_OPTIONS );
      }
      else {
        self.transitionNode.slideLeftTo( selectedSceneNode, TRANSITION_OPTIONS );
      }
    } );
  }

  equalityExplorer.register( 'SolveItScreenView', SolveItScreenView );

  return inherit( ScreenView, SolveItScreenView, {

    // @public
    reset: function() {
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