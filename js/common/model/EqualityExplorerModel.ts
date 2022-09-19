// Copyright 2017-2020, University of Colorado Boulder

// @ts-nocheck
/**
 * Abstract base type for models in the Equality Explorer sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import equalityExplorer from '../../equalityExplorer.js';

class EqualityExplorerModel {

  /**
   * @param {EqualityExplorerScene[]} scenes
   * @abstract
   */
  constructor( scenes ) {

    // @public {EqualityExplorerScene[]} scenes, in the order that they appear from left-to-right as radio buttons
    this.scenes = scenes;

    // @public {Property.<Scene>} the selected scene
    this.sceneProperty = new Property( scenes[ 0 ], {
      validValues: scenes
    } );

    // When the scene changes, dispose of any terms that are being dragged or animating, see #73.
    // unlink not needed.
    this.sceneProperty.lazyLink( scene => scene.disposeTermsNotOnScale() );
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    this.scenes.forEach( scene => scene.reset() );
    this.sceneProperty.reset();
  }

  /**
   * Updates time-dependent parts of the model.
   * @param {number} dt - time since the previous step, in seconds
   * @public
   */
  step( dt ) {

    // step the selected scene
    this.sceneProperty.value.step( dt );
  }

  /**
   * When the model is deactivated (by switching screens), delete all terms that are not on the scale.
   * @public
   */
  deactivate() {
    this.scenes.forEach( scene => scene.disposeTermsNotOnScale() );
  }
}

equalityExplorer.register( 'EqualityExplorerModel', EqualityExplorerModel );

export default EqualityExplorerModel;