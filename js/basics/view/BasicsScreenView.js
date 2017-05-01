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
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var EqualityExplorerSceneNode = require( 'EQUALITY_EXPLORER/common/view/EqualityExplorerSceneNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );

  /**
   * @param {BasicsModel} model
   * @constructor
   */
  function BasicsScreenView( model ) {

    ScreenView.call( this );

    var sceneNode = new EqualityExplorerSceneNode( model.scenes[ 0 ], this.layoutBounds );
    this.addChild( sceneNode );

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
      //TODO not correct
      right: resetAllButton.left - 30,
      bottom: this.layoutBounds.bottom - EqualityExplorerConstants.SCREEN_VIEW_Y_MARGIN
    } );
    this.addChild( sceneControl );
  }

  equalityExplorer.register( 'BasicsScreenView', BasicsScreenView );

  return inherit( ScreenView, BasicsScreenView, {

    //TODO Called by the animation loop. Optional, so if your view has no animation, please delete this.
    // @public
    step: function( dt ) {
      //TODO Handle view animation here.
    }
  } );
} );