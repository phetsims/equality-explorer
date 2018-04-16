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

    ScreenView.call( this, model );

    var gameAudioPlayer = new GameAudioPlayer( model.soundEnabledProperty );

    // UI for game settings
    var settingsNode = new LevelSelectionNode( model, this.layoutBounds );

    // @private {SolveItSceneNode[]} a scene for each level of the game
    this.sceneNodes = [];
    var scenesNodesParent = new Node();
    for ( var i = 0; i < model.scenes.length; i++ ) {
      var sceneNode = new SolveItSceneNode( model.scenes[ i ], model.sceneProperty,
        this.layoutBounds, this.visibleBoundsProperty, gameAudioPlayer );
      this.sceneNodes.push( sceneNode );
      scenesNodesParent.addChild( sceneNode );
    }

    var showingLeftProperty = new DerivedProperty( [ model.sceneProperty ], function( scene ) {
      return scene === null;
    } );

    this.slidingScreen = new SlidingScreen( settingsNode, scenesNodesParent, this.visibleBoundsProperty, showingLeftProperty );
    this.addChild( this.slidingScreen );
  }

  equalityExplorer.register( 'SolveItScreenView', SolveItScreenView );

  return inherit( ScreenView, SolveItScreenView, {

    /**
     * @param {number} dt - elapsed time, in seconds
     * @public
     */
    step: function( dt ) {
      this.slidingScreen.step( dt );
      for ( var i = 0; i < this.sceneNodes.length; i++ ) {
        if ( this.sceneNodes[ i ].visible ) {
          this.sceneNodes[ i ].step( dt );
        }
      }
    }
  } );
} );