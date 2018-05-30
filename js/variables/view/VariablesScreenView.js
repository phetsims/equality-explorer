// Copyright 2017-2018, University of Colorado Boulder

/**
 * View for the 'Variables' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerScreenView = require( 'EQUALITY_EXPLORER/common/view/EqualityExplorerScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var VariablesSceneNode = require( 'EQUALITY_EXPLORER/variables/view/VariablesSceneNode' );

  /**
   * @param {VariablesModel} model
   * @constructor
   */
  function VariablesScreenView( model ) {
    EqualityExplorerScreenView.call( this, model );
  }

  equalityExplorer.register( 'VariablesScreenView', VariablesScreenView );

  return inherit( EqualityExplorerScreenView, VariablesScreenView, {

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
      return new VariablesSceneNode( scene, sceneProperty, layoutBounds, options );
    }
  } );
} );