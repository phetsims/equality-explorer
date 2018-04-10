// Copyright 2017-2018, University of Colorado Boulder

/**
 * The sole scene in the 'Numbers' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ConstantTermCreator = require( 'EQUALITY_EXPLORER/common/model/ConstantTermCreator' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Scene = require( 'EQUALITY_EXPLORER/common/model/Scene' );

  /**
   * @constructor
   */
  function NumbersScene() {
    Scene.call( this, [ new ConstantTermCreator() ], [ new ConstantTermCreator() ], {
      debugName: 'numbers'
    } );
  }

  equalityExplorer.register( 'NumbersScene', NumbersScene );

  return inherit( Scene, NumbersScene );
} );
