// Copyright 2017, University of Colorado Boulder

/**
 * View for the 'Basics' screen.
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
  var SceneControl = require( 'EQUALITY_EXPLORER/common/view/SceneControl' );
  var SceneNode = require( 'EQUALITY_EXPLORER/common/view/SceneNode' );
  var ScreenView = require( 'JOIST/ScreenView' );

  /**
   * @param {BasicsModel} model
   * @constructor
   */
  function BasicsScreenView( model ) {

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

    var sceneControl = new SceneControl( model.scenes, model.sceneProperty, {
      right: resetAllButton.right,
      bottom: resetAllButton.top - 40
    } );
    this.addChild( sceneControl );

    // @private create the view for each scene
    this.sceneNodes = [];
    for ( var i = 0; i < model.scenes.length; i++ ) {
      var sceneNode = new SceneNode( model.scenes[ i ], model.sceneProperty, this.layoutBounds, {
        coupledControlVisible: false
      } );
      this.sceneNodes.push( sceneNode );
      this.addChild( sceneNode );
    }
  }

  equalityExplorer.register( 'BasicsScreenView', BasicsScreenView );

  return inherit( ScreenView, BasicsScreenView, {

    // @public
    reset: function() {
      for ( var i = 0; i < this.sceneNodes.length; i++ ) {
        this.sceneNodes[ i ].reset();
      }
    }
  } );
} );