// Copyright 2017, University of Colorado Boulder

//TODO lots of duplication with VariablesScreenView
/**
 * View for the 'Solving' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SolvingSceneNode = require( 'EQUALITY_EXPLORER/solving/view/SolvingSceneNode' );

  /**
   * @param {SolvingModel} model
   * @constructor
   */
  function SolvingScreenView( model ) {

    var self = this;

    ScreenView.call( this );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
        self.reset();
      },
      right: this.layoutBounds.maxX - EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - EqualityExplorerConstants.SCREEN_VIEW_Y_MARGIN
    } );
    this.addChild( resetAllButton );

    // @private
    this.sceneNode = new SolvingSceneNode( model.scene, this.layoutBounds );
    this.addChild( this.sceneNode );
  }

  equalityExplorer.register( 'SolvingScreenView', SolvingScreenView );

  return inherit( ScreenView, SolvingScreenView, {

    // @public
    reset: function() {
      this.sceneNode.reset();
    }
  } );
} );