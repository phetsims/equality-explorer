// Copyright 2017-2019, University of Colorado Boulder

/**
 * Model for the 'Variables' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const EqualityExplorerModel = require( 'EQUALITY_EXPLORER/common/model/EqualityExplorerModel' );
  const inherit = require( 'PHET_CORE/inherit' );
  const VariablesScene = require( 'EQUALITY_EXPLORER/variables/model/VariablesScene' );

  /**
   * @constructor
   */
  function VariablesModel() {
    EqualityExplorerModel.call( this, [ new VariablesScene() ] );
  }

  equalityExplorer.register( 'VariablesModel', VariablesModel );

  return inherit( EqualityExplorerModel, VariablesModel );
} );