// Copyright 2017, University of Colorado Boulder

/**
 * Model for the 'Numbers' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerModel = require( 'EQUALITY_EXPLORER/common/model/EqualityExplorerModel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumbersScene = require( 'EQUALITY_EXPLORER/numbers/model/NumbersScene' );

  /**
   * @constructor
   */
  function NumbersModel() {
    EqualityExplorerModel.call( this, [ new NumbersScene() ] );
  }

  equalityExplorer.register( 'NumbersModel', NumbersModel );

  return inherit( EqualityExplorerModel, NumbersModel );
} );