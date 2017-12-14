// Copyright 2017, University of Colorado Boulder

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
  var FruitsScene = require( 'EQUALITY_EXPLORER/basics/model/FruitsScene' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var ShapesScene = require( 'EQUALITY_EXPLORER/basics/model/ShapesScene' );

  /**
   * @constructor
   */
  function BasicsModel() {

    var self = this;

    // @public scenes, in the order that they appear from left-to-right as radio buttons
    this.scenes = [
      new ShapesScene(),
      new FruitsScene(),
      new CoinsScene(),
      new AnimalsScene()
    ];

    // @public the selected scene
    this.sceneProperty = new Property( this.scenes[ 0 ] );

    // validate scene, unlink unnecessary
    this.sceneProperty.link( function( scene ) {
      assert && assert( _.includes( self.scenes, scene ), 'invalid scene' );
    } );
  }

  equalityExplorer.register( 'BasicsModel', BasicsModel );

  return inherit( Object, BasicsModel, {

    /**
     * Resets the model.
     * @public
     */
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
      this.sceneProperty.value.step( dt );
    }
  } );
} );