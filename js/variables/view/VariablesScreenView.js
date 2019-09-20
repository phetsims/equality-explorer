// Copyright 2017-2019, University of Colorado Boulder

/**
 * View for the 'Variables' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const EqualityExplorerScreenView = require( 'EQUALITY_EXPLORER/common/view/EqualityExplorerScreenView' );
  const inherit = require( 'PHET_CORE/inherit' );
  const VariablesSceneNode = require( 'EQUALITY_EXPLORER/variables/view/VariablesSceneNode' );

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
      return new VariablesSceneNode( scene, sceneProperty, equationAccordionBoxExpandedProperty,
        snapshotsAccordionBoxExpandedProperty, layoutBounds, options );
    }
  } );
} );