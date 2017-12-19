// Copyright 2017, University of Colorado Boulder

/**
 * Base type for models in the Equality Explorer sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  /**
   * @constructor
   */
  function EqualityExplorerModel( scenes ) {

    // @public scenes, in the order that they appear from left-to-right as radio buttons
    this.scenes = scenes;

    // @public the selected scene
    this.sceneProperty = new Property( this.scenes[ 0 ], {
      isValidValue: function( scene ) {
        return _.includes( scenes, scene );
      }
    } );
  }

  equalityExplorer.register( 'EqualityExplorerModel', EqualityExplorerModel );

  return inherit( Object, EqualityExplorerModel, {

    /**
     * Resets the model.
     * @public
     */
    reset: function() {
      this.scenes.forEach( function( scene ) {
        scene.reset();
      } );
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