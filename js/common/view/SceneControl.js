// Copyright 2017-2020, University of Colorado Boulder

/**
 * Radio buttons for selecting a scene.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import equalityExplorer from '../../equalityExplorer.js';

class SceneControl extends RectangularRadioButtonGroup {

  /**
   * @param {EqualityExplorerScene[]} scenes - the scene choices
   * @param {Property.<EqualityExplorerScene>} sceneProperty - the scene that is currently selected
   * @param {Object} [options]
   */
  constructor( scenes, sceneProperty, options ) {

    options = merge( {

      // RectangularRadioButtonGroup options
      orientation: 'horizontal',
      baseColor: 'white',
      spacing: 8,
      buttonContentXMargin: 15,
      buttonContentYMargin: 12
    }, options );

    // describe a radio button for each scene
    const contentArray = [];
    scenes.forEach( scene => {
      assert && assert( scene.icon, 'scene must have an icon' );
      contentArray.push( {
        value: scene,
        node: scene.icon
      } );
    } );

    super( sceneProperty, contentArray, options );
  }
}

equalityExplorer.register( 'SceneControl', SceneControl );

export default SceneControl;