// Copyright 2017-2022, University of Colorado Boulder

/**
 * Radio buttons for selecting a scene.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupOptions, RectangularRadioButtonItem } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerScene from '../model/EqualityExplorerScene.js';

type SelfOptions = EmptySelfOptions;

type SceneRadioButtonGroupOptions = SelfOptions;

export default class SceneRadioButtonGroup extends RectangularRadioButtonGroup<EqualityExplorerScene> {

  public constructor( scenes: EqualityExplorerScene[], sceneProperty: Property<EqualityExplorerScene>,
                      providedOptions?: SceneRadioButtonGroupOptions ) {

    const options = optionize<SceneRadioButtonGroupOptions, SelfOptions, RectangularRadioButtonGroupOptions>()( {

      // RectangularRadioButtonGroupOptions
      orientation: 'horizontal',
      spacing: 8,
      radioButtonOptions: {
        baseColor: 'white',
        xMargin: 15,
        yMargin: 12
      }
    }, providedOptions );

    // describe a radio button for each scene
    const contentArray: RectangularRadioButtonItem<EqualityExplorerScene>[] = [];
    scenes.forEach( scene => {
      assert && assert( scene.icon, 'scene must have an icon' );
      contentArray.push( {
        value: scene,
        node: scene.icon
      } );
    } );

    super( sceneProperty, contentArray, options );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

equalityExplorer.register( 'SceneRadioButtonGroup', SceneRadioButtonGroup );