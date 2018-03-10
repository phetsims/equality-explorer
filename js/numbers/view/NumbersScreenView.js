// Copyright 2017, University of Colorado Boulder

/**
 * View for the 'Numbers' screen.
 * Adds no new functionality. Provided for symmetry, so that every screen has ScreenView and model types.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerScreenView = require( 'EQUALITY_EXPLORER/common/view/EqualityExplorerScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {NumbersModel} model
   * @constructor
   */
  function NumbersScreenView( model ) {
    EqualityExplorerScreenView.call( this, model );
  }

  equalityExplorer.register( 'NumbersScreenView', NumbersScreenView );

  return inherit( EqualityExplorerScreenView, NumbersScreenView );
} );