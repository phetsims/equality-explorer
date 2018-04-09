// Copyright 2018, University of Colorado Boulder

/**
 * View for the 'Solve It!' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var GameAudioPlayer = require( 'VEGAS/GameAudioPlayer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SettingsNode = require( 'EQUALITY_EXPLORER/solveit/view/SettingsNode' );
  var SolveItSceneNode = require( 'EQUALITY_EXPLORER/solveit/view/SolveItSceneNode' );

  /**
   * @param {SolveItModel} model
   * @constructor
   */
  function SolveItScreenView( model ) {

    ScreenView.call( this, model );

    var gameAudioPlayer = new GameAudioPlayer( model.soundEnabledProperty );

    // UI for game settings
    var settingsNode = new SettingsNode( model, this.layoutBounds );
    this.addChild( settingsNode );

    // @private {SolveItSceneNode[]} a scene for each level of the game
    this.sceneNodes = [];
    for ( var i = 0; i < model.scenes.length; i++ ) {
      this.addChild( new SolveItSceneNode( model.scenes[ i ], model,
        this.layoutBounds, this.visibleBoundsProperty, gameAudioPlayer ) );
    }
  }

  equalityExplorer.register( 'SolveItScreenView', SolveItScreenView );

  return inherit( ScreenView, SolveItScreenView, {

    /**
     * Steps the SolveItSceneNode that is currently visible.
     * @param {number} dt - elapsed time, in seconds
     * @public
     */
    step: function( dt ) {
      for ( var i = 0; i < this.sceneNodes.length; i++ ) {
        if ( this.sceneNodes[ i ].visible ) {
          this.sceneNodes[ i ].step( dt );
        }
      }
    }
  } );
} );