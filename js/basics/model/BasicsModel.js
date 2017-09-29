// Copyright 2017, University of Colorado Boulder

/**
 * Model for the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var CoinsScene = require( 'EQUALITY_EXPLORER/basics/model/CoinsScene' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var FruitScene = require( 'EQUALITY_EXPLORER/basics/model/FruitScene' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var ShapesScene = require( 'EQUALITY_EXPLORER/basics/model/ShapesScene' );
  var SpheresScene = require( 'EQUALITY_EXPLORER/basics/model/SpheresScene' );

  /**
   * @constructor
   */
  function BasicsModel() {

    // @public
    this.scenes = [
      new ShapesScene(),
      new FruitScene(),
      new CoinsScene(),
      new SpheresScene()
    ];

    // @public the selected scene
    this.sceneProperty = new Property( this.scenes[ 0 ] );
  }

  equalityExplorer.register( 'BasicsModel', BasicsModel );

  return inherit( Object, BasicsModel, {

    // @public resets the model
    reset: function() {
      for ( var i = 0; i < this.scenes.length; i++ ) {
        this.scenes[ i ].reset();
      }
      this.sceneProperty.reset();
    },

    /**
     * Updates time-dependent parts of the model.
     * @param {number} dt - time since the previous step, in seconds
     * @public
     */
    step: function( dt ) {

      // step the selected scene
      for ( var i = 0; i < this.scenes.length; i++ ) {
        if ( this.scenes[ i ] === this.sceneProperty.value ) {
          this.scenes[ i ].step( dt );
          break;
        }
      }
    }
  } );
} );