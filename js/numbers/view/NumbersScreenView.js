// Copyright 2017, University of Colorado Boulder

/**
 * View for the 'Numbers' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerScreenView = require( 'EQUALITY_EXPLORER/common/view/EqualityExplorerScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var SceneNode = require( 'EQUALITY_EXPLORER/common/view/SceneNode' );

  /**
   * @param {NumbersModel} model
   * @constructor
   */
  function NumbersScreenView( model ) {

    EqualityExplorerScreenView.call( this, model );

    // @private
    this.sceneNode = new SceneNode( model.scene, this.layoutBounds );
    this.addChild( this.sceneNode );
  }

  equalityExplorer.register( 'NumbersScreenView', NumbersScreenView );

  return inherit( EqualityExplorerScreenView, NumbersScreenView, {

    /**
     * Resets things that are specific to the view.
     * @public
     */
    reset: function() {
      this.sceneNode.reset();
    }
  } );
} );