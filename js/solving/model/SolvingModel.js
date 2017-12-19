// Copyright 2017, University of Colorado Boulder

/**
 * Model for the 'Solving' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerModel = require( 'EQUALITY_EXPLORER/common/model/EqualityExplorerModel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var SolvingScene = require( 'EQUALITY_EXPLORER/solving/model/SolvingScene' );

  /**
   * @constructor
   */
  function SolvingModel() {
    EqualityExplorerModel.call( this, [ new SolvingScene() ] );
  }

  equalityExplorer.register( 'SolvingModel', SolvingModel );

  return inherit( EqualityExplorerModel, SolvingModel );
} );