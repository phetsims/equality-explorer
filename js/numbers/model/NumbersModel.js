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

  /**
   * @constructor
   */
  function NumbersModel() {
    //TODO implement constructor
  }

  equalityExplorer.register( 'NumbersModel', NumbersModel );

  return inherit( Object, NumbersModel, {

    // @public resets the model
    reset: function() {
      //TODO implement reset
    },

    // @public
    step: function( dt ) {
      //TODO implement step
    }
  } );
} );