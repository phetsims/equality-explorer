// Copyright 2017-2018, University of Colorado Boulder

/**
 * View for the 'Operations' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerScreenView = require( 'EQUALITY_EXPLORER/common/view/EqualityExplorerScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var OperationsSceneNode = require( 'EQUALITY_EXPLORER/operations/view/OperationsSceneNode' );

  /**
   * @param {OperationsModel} model
   * @constructor
   */
  function OperationsScreenView( model ) {
    EqualityExplorerScreenView.call( this, model );
  }

  equalityExplorer.register( 'OperationsScreenView', OperationsScreenView );

  return inherit( EqualityExplorerScreenView, OperationsScreenView, {

    /**
     * Creates the Node for this scene.
     * @param {EqualityExplorerScene} scene
     * @param {Property.<EqualityExplorerScene>} sceneProperty - the selected scene
     * @param {BooleanProperty} equationAccordionBoxExpandedProperty
     * @param {BooleanProperty} snapshotsAccordionBoxExpandedProperty
     * @param {Bounds2} layoutBounds
     * @param {Object} [options]
     * @returns {Node}
     * @protected
     * @override
     */
    createSceneNode: function( scene, sceneProperty, equationAccordionBoxExpandedProperty,
                               snapshotsAccordionBoxExpandedProperty, layoutBounds, options ) {
      return new OperationsSceneNode( scene, sceneProperty, equationAccordionBoxExpandedProperty,
        snapshotsAccordionBoxExpandedProperty, layoutBounds, options );
    }
  } );
} );