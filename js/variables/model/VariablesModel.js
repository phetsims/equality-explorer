// Copyright 2017, University of Colorado Boulder

/**
 * Model for the 'Variables' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerModel = require( 'EQUALITY_EXPLORER/common/model/EqualityExplorerModel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var VariablesScene = require( 'EQUALITY_EXPLORER/variables/model/VariablesScene' );

  /**
   * @constructor
   */
  function VariablesModel() {

    // this screen has 1 scene
    EqualityExplorerModel.call( this, [ new VariablesScene() ] );
  }

  equalityExplorer.register( 'VariablesModel', VariablesModel );

  return inherit( EqualityExplorerModel, VariablesModel );
} );