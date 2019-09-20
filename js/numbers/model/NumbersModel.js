// Copyright 2017-2019, University of Colorado Boulder

/**
 * Model for the 'Numbers' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const EqualityExplorerModel = require( 'EQUALITY_EXPLORER/common/model/EqualityExplorerModel' );
  const inherit = require( 'PHET_CORE/inherit' );
  const NumbersScene = require( 'EQUALITY_EXPLORER/numbers/model/NumbersScene' );

  /**
   * @constructor
   */
  function NumbersModel() {
    EqualityExplorerModel.call( this, [ new NumbersScene() ] );
  }

  equalityExplorer.register( 'NumbersModel', NumbersModel );

  return inherit( EqualityExplorerModel, NumbersModel );
} );