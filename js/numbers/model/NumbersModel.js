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
  var inherit = require( 'PHET_CORE/inherit' );
  var NumbersScene = require( 'EQUALITY_EXPLORER/numbers/model/NumbersScene' );

  /**
   * @constructor
   */
  function NumbersModel() {

    // @public (read-only)
    this.scene = new NumbersScene();
  }

  equalityExplorer.register( 'NumbersModel', NumbersModel );

  return inherit( Object, NumbersModel, {

    // @public resets the model
    reset: function() {
      this.scene.reset();
    },

    // @public
    step: function( dt ) {
      this.scene.step( dt );
    }
  } );
} );