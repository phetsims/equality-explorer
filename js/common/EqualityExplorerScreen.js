// Copyright 2018, University of Colorado Boulder

/**
 * Abstract base type for Screens in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );

  /**
   * @param {function} createModel
   * @param {function(model):Node } createView
   * @param {Object} [options]
   * @constructor
   */
  function EqualityExplorerScreen( createModel, createView, options ) {

    var self = this;

    Screen.call( this, createModel, createView, options );

    // When this Screen is deactivated, deactivate the model.  unlink not needed.
    this.screenActiveProperty.lazyLink( function( screenActive ) {
      if ( !screenActive && self.model.deactivate ) {
        self.model.deactivate();
      }
    } );
  }

  equalityExplorer.register( 'EqualityExplorerScreen', EqualityExplorerScreen );

  return inherit( Screen, EqualityExplorerScreen );
} );