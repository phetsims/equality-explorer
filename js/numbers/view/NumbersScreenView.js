// Copyright 2017-2018, University of Colorado Boulder

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
  var NumbersSceneNode = require( 'EQUALITY_EXPLORER/numbers/view/NumbersSceneNode' );

  /**
   * @param {NumbersModel} model
   * @constructor
   */
  function NumbersScreenView( model ) {
    EqualityExplorerScreenView.call( this, model );
  }

  equalityExplorer.register( 'NumbersScreenView', NumbersScreenView );

  return inherit( EqualityExplorerScreenView, NumbersScreenView, {

    /**
     * Creates the Node for this scene.
     * @param {EqualityExplorerScene} scene
     * @param {Property.<EqualityExplorerScene>} sceneProperty - the selected scene
     * @param {Bounds2} layoutBounds
     * @param {Object} [options]
     * @returns {Node}
     * @protected
     * @override
     */
    createSceneNode: function( scene, sceneProperty, layoutBounds, options ) {
      return new NumbersSceneNode( scene, sceneProperty, layoutBounds, options );
    }
  } );
} );