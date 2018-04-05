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

    ScreenView.call( this, model );

    var settingsNode = new SettingsNode( model, this.layoutBounds, {

      /**
       * Level selection button listener
       * @param {number} level
       */
      buttonListener: function( level ) {
        model.levelProperty.value = level;
        settingsNode.visible = false;
        playNode.visible = true;
      }
    } );
    this.addChild( settingsNode );

    var playNode = new PlayNode( model, this.visibleBoundsProperty, {
      visible: false,
      backButtonListener: function() {
        playNode.visible = false;
        settingsNode.visible = true;
      }
    } );
    this.addChild( playNode );
  }

  equalityExplorer.register( 'SolveItScreenView', SolveItScreenView );

  return inherit( ScreenView, SolveItScreenView );
} );