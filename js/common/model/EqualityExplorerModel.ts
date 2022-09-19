// Copyright 2017-2020, University of Colorado Boulder

/**
 * Base class for models in the Equality Explorer sim, except for SolveItModel (the game).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import TModel from '../../../../joist/js/TModel.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerScene from './EqualityExplorerScene.js';

export default class EqualityExplorerModel<T extends EqualityExplorerScene> implements TModel {

  // scenes, in the order that they appear from left-to-right as radio buttons
  public readonly scenes: T[];

  // the selected scene
  public readonly sceneProperty: Property<T>;

  protected constructor( scenes: T[] ) {

    this.scenes = scenes;
    this.sceneProperty = new Property( scenes[ 0 ], {
      validValues: scenes
    } );

    // When the scene changes, dispose of any terms that are being dragged or animating.
    // See https://github.com/phetsims/equality-explorer/issues/73
    this.sceneProperty.lazyLink( scene => scene.disposeTermsNotOnScale() );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.scenes.forEach( scene => scene.reset() );
    this.sceneProperty.reset();
  }

  /**
   * Updates time-dependent parts of the model.
   * @param dt - time since the previous step, in seconds
   */
  public step( dt: number ): void {

    // step the selected scene
    this.sceneProperty.value.step( dt );
  }

  /**
   * When the model is deactivated (by switching screens), delete all terms that are not on the scale.
   */
  public deactivate(): void {
    this.scenes.forEach( scene => scene.disposeTermsNotOnScale() );
  }
}

equalityExplorer.register( 'EqualityExplorerModel', EqualityExplorerModel );