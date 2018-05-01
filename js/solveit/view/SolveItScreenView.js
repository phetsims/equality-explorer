// Copyright 2018, University of Colorado Boulder

/**
 * View for the 'Solve It!' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var GameAudioPlayer = require( 'VEGAS/GameAudioPlayer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LevelSelectionNode = require( 'EQUALITY_EXPLORER/solveit/view/LevelSelectionNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SlidingScreen = require( 'TWIXT/SlidingScreen' );
  var SolveItSceneNode = require( 'EQUALITY_EXPLORER/solveit/view/SolveItSceneNode' );

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
    var scenesParent = new Node( {
      children: this.sceneNodes
    } );

    // {DerivedProperty.<boolean>} Are we showing the level-selection UI?
    // dispose not needed.
    var showingLevelSelectionProperty = new DerivedProperty( [ model.sceneProperty ], function( scene ) {
      return ( scene === null );
    } );

    // Handles animated 'slide' transitions between level-selection and challenges
    this.slideNode = new SlidingScreen( levelSelectionNode, scenesParent,
      this.visibleBoundsProperty, showingLevelSelectionProperty );
    this.addChild( this.slideNode );

    // Make the selected scene (level) visible. unlink not needed.
    model.sceneProperty.link( function( scene ) {

      // Skip null (no scene selected), so that scene is shown during wipe transition
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
      this.slideNode.step( dt );

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