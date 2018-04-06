// Copyright 2017-2018, University of Colorado Boulder

/**
 * Model for the 'x & y' screen.
 * This code is not part of the production sim - see XYScreen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerModel = require( 'EQUALITY_EXPLORER/common/model/EqualityExplorerModel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var XYScene = require( 'EQUALITY_EXPLORER/xy/model/XYScene' );

  /**
   * @constructor
   */
  function XYModel() {
    EqualityExplorerModel.call( this, [ new XYScene() ] );
  }

  equalityExplorer.register( 'XYModel', XYModel );

  return inherit( EqualityExplorerModel, XYModel );
} );