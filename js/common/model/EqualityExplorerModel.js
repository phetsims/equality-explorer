// Copyright 2017-2018, University of Colorado Boulder

/**
 * Abstract base type for models in the Equality Explorer sim.
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
   * @param {EqualityExplorerScene[]} scenes
   * @constructor
   * @abstract
   */
  function EqualityExplorerModel( scenes ) {

    // @public {EqualityExplorerScene[]} scenes, in the order that they appear from left-to-right as radio buttons
    this.scenes = scenes;

    // @public {Property.<Scene>} the selected scene
    this.sceneProperty = new Property( scenes[ 0 ], {
      validValues: scenes
    } );

    // When the scene changes, dispose of any terms that are being dragged or animating, see #73.
    // unlink not needed.
    this.sceneProperty.lazyLink( function( scene ) {
      scene.disposeTermsNotOnScale();
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
    },

    /**
     * When the model is deactivated (by switching screens), delete all terms that are not on the scale.
     * @public
     */
    deactivate: function() {
      this.scenes.forEach( function( scene ) {
        scene.disposeTermsNotOnScale();
      } );
    }
  } );
} );