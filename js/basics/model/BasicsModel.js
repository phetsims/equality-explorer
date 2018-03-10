// Copyright 2017-2018, University of Colorado Boulder

/**
 * Model for the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var AnimalsScene = require( 'EQUALITY_EXPLORER/basics/model/AnimalsScene' );
  var CoinsScene = require( 'EQUALITY_EXPLORER/basics/model/CoinsScene' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerModel = require( 'EQUALITY_EXPLORER/common/model/EqualityExplorerModel' );
  var FruitsScene = require( 'EQUALITY_EXPLORER/basics/model/FruitsScene' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ShapesScene = require( 'EQUALITY_EXPLORER/basics/model/ShapesScene' );

  /**
   * @constructor
   */
  function BasicsModel() {
    EqualityExplorerModel.call( this, [

      // in the order that they appear (left to right) in the scene control
      new ShapesScene(),
      new FruitsScene(),
      new CoinsScene(),
      new AnimalsScene()
    ] );
  }

  equalityExplorer.register( 'BasicsModel', BasicsModel );

  return inherit( EqualityExplorerModel, BasicsModel );
} );