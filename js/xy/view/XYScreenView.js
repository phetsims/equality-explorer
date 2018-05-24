// Copyright 2017-2018, University of Colorado Boulder

/**
 * View for the 'XY' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerScreenView = require( 'EQUALITY_EXPLORER/common/view/EqualityExplorerScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var XYSceneNode = require( 'EQUALITY_EXPLORER/xy/view/XYSceneNode' );

  /**
   * @param {XYModel} model
   * @constructor
   */
  function XYScreenView( model ) {
    EqualityExplorerScreenView.call( this, model, {
      createSceneNode: function( scene, sceneProperty, layoutBounds, options ) {
        return new XYSceneNode( scene, sceneProperty, layoutBounds, options );
      }
    } );
  }

  equalityExplorer.register( 'XYScreenView', XYScreenView );

  return inherit( EqualityExplorerScreenView, XYScreenView );
} );