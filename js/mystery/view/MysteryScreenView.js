// Copyright 2018, University of Colorado Boulder

/**
 * View for the 'Mystery' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );

  /**
   * @param {MysteryModel} model
   * @constructor
   */
  function MysteryScreenView( model ) {
    ScreenView.call( this, model );
    //TODO
  }

  equalityExplorer.register( 'MysteryScreenView', MysteryScreenView );

  return inherit( ScreenView, MysteryScreenView );
} );