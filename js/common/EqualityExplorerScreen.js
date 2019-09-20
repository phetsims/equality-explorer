// Copyright 2018-2019, University of Colorado Boulder

/**
 * Abstract base type for Screens in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Screen = require( 'JOIST/Screen' );

  /**
   * @param {function} createModel
   * @param {function(model):Node } createView
   * @param {Object} [options]
   * @constructor
   * @abstract
   */
  function EqualityExplorerScreen( createModel, createView, options ) {

    const self = this;

    Screen.call( this, createModel, createView, options );

    // When this Screen is deactivated, deactivate the model.  unlink not needed.
    this.activeProperty.lazyLink( function( screenActive ) {
      if ( !screenActive && self.model.deactivate ) {
        self.model.deactivate();
      }
    } );
  }

  equalityExplorer.register( 'EqualityExplorerScreen', EqualityExplorerScreen );

  return inherit( Screen, EqualityExplorerScreen );
} );