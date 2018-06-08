// Copyright 2017-2018, University of Colorado Boulder

/**
 * View for the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BasicsSceneNode = require( 'EQUALITY_EXPLORER/basics/view/BasicsSceneNode' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerScreenView = require( 'EQUALITY_EXPLORER/common/view/EqualityExplorerScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {BasicsModel} model
   * @constructor
   */
  function BasicsScreenView( model ) {
    EqualityExplorerScreenView.call( this, model, {
      hasNegativeTermsInToolbox: false // only positive terms in the toolbox
    } );
  }

  equalityExplorer.register( 'BasicsScreenView', BasicsScreenView );

  return inherit( EqualityExplorerScreenView, BasicsScreenView, {

    /**
     * Creates the Node for this scene.
     * @param {EqualityExplorerScene} scene
     * @param {Property.<EqualityExplorerScene>} sceneProperty - the selected scene
     * @param {BooleanProperty} snapshotsAccordionBoxExpandedProperty
     * @param {Bounds2} layoutBounds
     * @param {Object} [options]
     * @returns {Node}
     * @protected
     * @override
     */
    createSceneNode: function( scene, sceneProperty, snapshotsAccordionBoxExpandedProperty, layoutBounds, options ) {
      return new BasicsSceneNode( scene, sceneProperty, snapshotsAccordionBoxExpandedProperty, layoutBounds, options );
    }
  } );
} );