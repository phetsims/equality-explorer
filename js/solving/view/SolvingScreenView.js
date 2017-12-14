// Copyright 2017, University of Colorado Boulder

/**
 * View for the 'Solving' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerScreenView = require( 'EQUALITY_EXPLORER/common/view/EqualityExplorerScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var SolvingSceneNode = require( 'EQUALITY_EXPLORER/solving/view/SolvingSceneNode' );

  /**
   * @param {SolvingModel} model
   * @constructor
   */
  function SolvingScreenView( model ) {

    EqualityExplorerScreenView.call( this, model );

    // @private
    this.sceneNode = new SolvingSceneNode( model.scene, this.layoutBounds );
    this.addChild( this.sceneNode );
  }

  equalityExplorer.register( 'SolvingScreenView', SolvingScreenView );

  return inherit( EqualityExplorerScreenView, SolvingScreenView, {

    /**
     * Resets things that are specific to the view.
     * @public
     */
    reset: function() {
      this.sceneNode.reset();
    }
  } );
} );