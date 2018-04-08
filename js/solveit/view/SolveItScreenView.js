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
  var inherit = require( 'PHET_CORE/inherit' );
  var PlayingNode = require( 'EQUALITY_EXPLORER/solveit/view/PlayingNode' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SettingsNode = require( 'EQUALITY_EXPLORER/solveit/view/SettingsNode' );

  /**
   * @param {SolveItModel} model
   * @constructor
   */
  function SolveItScreenView( model ) {

    var self = this;

    ScreenView.call( this, model );

    var settingsNode = new SettingsNode( model, this.layoutBounds );
    this.addChild( settingsNode );

    // @private
    this.playingNode = new PlayingNode( model, this.layoutBounds, this.visibleBoundsProperty );
    this.addChild( this.playingNode );

    model.stateProperty.link( function( state ) {
      settingsNode.visible = ( state === 'settings' );
      self.playingNode.visible = ( state === 'playing' );
    } );
  }

  equalityExplorer.register( 'SolveItScreenView', SolveItScreenView );

  return inherit( ScreenView, SolveItScreenView, {

    /**
     * @param {number} dt - elapsed time, in seconds
     * @public
     */
    step: function( dt ) {
      this.playingNode.step( dt );
    }
  } );
} );