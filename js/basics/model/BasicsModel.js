// Copyright 2017-2019, University of Colorado Boulder

/**
 * Model for the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AnimalsScene = require( 'EQUALITY_EXPLORER/basics/model/AnimalsScene' );
  const CoinsScene = require( 'EQUALITY_EXPLORER/basics/model/CoinsScene' );
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const EqualityExplorerModel = require( 'EQUALITY_EXPLORER/common/model/EqualityExplorerModel' );
  const FruitsScene = require( 'EQUALITY_EXPLORER/basics/model/FruitsScene' );
  const inherit = require( 'PHET_CORE/inherit' );
  const ShapesScene = require( 'EQUALITY_EXPLORER/basics/model/ShapesScene' );

  /**
   * @constructor
   */
  function BasicsModel() {
    EqualityExplorerModel.call( this, [

      // in the order that they appear (left to right) in the scene control (radio buttons)
      new ShapesScene(),
      new FruitsScene(),
      new CoinsScene(),
      new AnimalsScene()
    ] );
  }

  equalityExplorer.register( 'BasicsModel', BasicsModel );

  return inherit( EqualityExplorerModel, BasicsModel );
} );