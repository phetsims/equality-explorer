// Copyright 2017-2018, University of Colorado Boulder

/**
 * View for the 'Basics' screen.
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
   * @param {BasicsModel} model
   * @constructor
   */
  function BasicsScreenView( model ) {
    EqualityExplorerScreenView.call( this, model, {
      inverseTermsInToolbox: false // create Node for positive terms only in the toolbox
    } );
  }

  equalityExplorer.register( 'BasicsScreenView', BasicsScreenView );

  return inherit( EqualityExplorerScreenView, BasicsScreenView );
} );