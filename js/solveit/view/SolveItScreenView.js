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
      buttonListener: function( level ) {
        model.levelProperty.value = level;
        settingsNode.visible = false;
        self.playNode.visible = true;
      }
    } );
    this.addChild( settingsNode );

    // @private
    this.playNode = new PlayNode( model, this.layoutBounds, this.visibleBoundsProperty, {
      visible: false,
      backButtonListener: function() {
        self.playNode.visible = false;
        settingsNode.visible = true;
      }
    } );
    this.addChild( this.playNode );
  }

  equalityExplorer.register( 'SolveItScreenView', SolveItScreenView );

  return inherit( ScreenView, SolveItScreenView, {

    /**
     * @param {number} dt - elapsed time, in seconds
     * @public
     */
    step: function( dt ) {
      this.playNode.step( dt );
    }
  } );
} );