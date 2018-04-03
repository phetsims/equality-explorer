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
  var PlayNode = require( 'EQUALITY_EXPLORER/solveit/view/PlayNode' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SettingsNode = require( 'EQUALITY_EXPLORER/solveit/view/SettingsNode' );

  /**
   * @param {SolveItModel} model
   * @constructor
   */
  function SolveItScreenView( model ) {

    var self = this;

    ScreenView.call( this, model );

    var settingsNode = new SettingsNode( model, this.layoutBounds, {

      /**
       * Level selection button listener
       * @param {number} level
       */
      buttonListener: function( level ) {

        // hide settingsNode
        settingsNode.visible = false;

        // change the level
        model.levelProperty.value = level;

        // show the game play UI
        var playNode = new PlayNode( model, self.visibleBoundsProperty, {
          backButtonListener: function() {
            playNode.dispose();
            settingsNode.visible = true;
          }
        } );
        self.addChild( playNode );
      }
    } );
    this.addChild( settingsNode );
  }

  equalityExplorer.register( 'SolveItScreenView', SolveItScreenView );

  return inherit( ScreenView, SolveItScreenView );
} );