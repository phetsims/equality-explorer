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
    EqualityExplorerScreenView.call( this, model, {
      createSceneNode: function( scene, sceneProperty, layoutBounds, options ) {
        return new OperationsSceneNode( scene, sceneProperty, layoutBounds, options );
      }
    } );
  }

  equalityExplorer.register( 'OperationsScreenView', OperationsScreenView );

  return inherit( EqualityExplorerScreenView, OperationsScreenView );
} );