// Copyright 2017-2018, University of Colorado Boulder

/**
 * Model for the 'Operations' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const EqualityExplorerModel = require( 'EQUALITY_EXPLORER/common/model/EqualityExplorerModel' );
  const inherit = require( 'PHET_CORE/inherit' );
  const OperationsScene = require( 'EQUALITY_EXPLORER/operations/model/OperationsScene' );

  /**
   * @constructor
   */
  function OperationsModel() {
    EqualityExplorerModel.call( this, [ new OperationsScene() ] );
  }

  equalityExplorer.register( 'OperationsModel', OperationsModel );

  return inherit( EqualityExplorerModel, OperationsModel );
} );