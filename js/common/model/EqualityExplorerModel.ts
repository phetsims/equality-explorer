// Copyright 2017-2023, University of Colorado Boulder

/**
 * Base class for models in the Equality Explorer sim, except for SolveItModel (the game).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Disposable from '../../../../axon/js/Disposable.js';
import Property from '../../../../axon/js/Property.js';
import TModel from '../../../../joist/js/TModel.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerScene from './EqualityExplorerScene.js';

export default class EqualityExplorerModel extends PhetioObject implements TModel {

  // scenes, in the order that they appear from left-to-right as radio buttons
  public readonly scenes: EqualityExplorerScene[];

  // the selected scene
  public readonly sceneProperty: Property<EqualityExplorerScene>;

  protected constructor( scenes: EqualityExplorerScene[], tandem: Tandem ) {

    super( {
      tandem: tandem,
      phetioState: false
    } );

    this.scenes = scenes;

    // Instrument sceneProperty only if there is more than 1 scene, and sceneProperty therefore can be changed.
    const scenePropertyTandem = ( scenes.length > 1 ) ? tandem.createTandem( 'sceneProperty' ) : Tandem.OPT_OUT;

    this.sceneProperty = new Property( scenes[ 0 ], {
      validValues: scenes,
      tandem: scenePropertyTandem,
      phetioValueType: EqualityExplorerScene.EqualityExplorerSceneIO
    } );

    // When the scene changes, dispose of any terms that are being dragged or animating.
    // See https://github.com/phetsims/equality-explorer/issues/73
    if ( scenes.length > 1 ) {
      this.sceneProperty.lazyLink( scene => scene.disposeTermsNotOnScale() );
    }
  }

  public override dispose(): void {
    Disposable.assertNotDisposable();
    super.dispose();
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