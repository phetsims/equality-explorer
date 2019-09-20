// Copyright 2017-2019, University of Colorado Boulder

/**
 * View for the 'Numbers' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const EqualityExplorerScreenView = require( 'EQUALITY_EXPLORER/common/view/EqualityExplorerScreenView' );
  const inherit = require( 'PHET_CORE/inherit' );
  const NumbersSceneNode = require( 'EQUALITY_EXPLORER/numbers/view/NumbersSceneNode' );

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
     * param {BooleanProperty} equationAccordionBoxExpandedProperty
     * param {BooleanProperty} snapshotsAccordionBoxExpandedProperty
     * @param {Bounds2} layoutBounds
     * @param {Object} [options]
     * @returns {Node}
     * @protected
     * @override
     */
    createSceneNode: function( scene, sceneProperty, equationAccordionBoxExpandedProperty,
                               snapshotsAccordionBoxExpandedProperty, layoutBounds, options ) {
      return new NumbersSceneNode( scene, sceneProperty, equationAccordionBoxExpandedProperty,
        snapshotsAccordionBoxExpandedProperty, layoutBounds, options );
    }
  } );
} );