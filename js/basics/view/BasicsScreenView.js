// Copyright 2017, University of Colorado Boulder

/**
 * View for the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BasicsSceneControl = require( 'EQUALITY_EXPLORER/basics/view/BasicsSceneControl' );
  var BasicsSceneNode = require( 'EQUALITY_EXPLORER/basics/view/BasicsSceneNode' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );

  /**
   * @param {BasicsModel} model
   * @constructor
   */
  function BasicsScreenView( model ) {

    ScreenView.call( this );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      right: this.layoutBounds.maxX - EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - EqualityExplorerConstants.SCREEN_VIEW_Y_MARGIN
    } );
    this.addChild( resetAllButton );

    var sceneControl = new BasicsSceneControl( model.scenes, model.sceneProperty, {
      right: resetAllButton.left - 30,
      bottom: this.layoutBounds.bottom - EqualityExplorerConstants.SCREEN_VIEW_Y_MARGIN
    } );
    this.addChild( sceneControl );

    // create the view for each scene
    for ( var i = 0; i < model.scenes.length; i++ ) {
      var categoryNode = new BasicsSceneNode( model.scenes[ i ], model.sceneProperty, this.layoutBounds );
      this.addChild( categoryNode );
    }
  }

  equalityExplorer.register( 'BasicsScreenView', BasicsScreenView );

  return inherit( ScreenView, BasicsScreenView );
} );