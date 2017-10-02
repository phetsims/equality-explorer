// Copyright 2017, University of Colorado Boulder

//TODO lots of duplication with VariablesModel
/**
 * Model for the 'Solving' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var SolvingScene = require( 'EQUALITY_EXPLORER/solving/model/SolvingScene' );

  /**
   * @constructor
   */
  function SolvingModel() {

    // @public (read-only)
    this.scene = new SolvingScene();
  }

  equalityExplorer.register( 'SolvingModel', SolvingModel );

  return inherit( Object, SolvingModel, {

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