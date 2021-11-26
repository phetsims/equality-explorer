// Copyright 2017-2021, University of Colorado Boulder

/**
 * The 'Animals' scene in the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Image } from '../../../../scenery/js/imports.js';
import cat_png from '../../../images/cat_png.js';
import catShadow_png from '../../../images/catShadow_png.js';
import dog_png from '../../../images/dog_png.js';
import dogShadow_png from '../../../images/dogShadow_png.js';
import turtle_png from '../../../images/turtle_png.js';
import turtleShadow_png from '../../../images/turtleShadow_png.js';
import EqualityExplorerConstants from '../../common/EqualityExplorerConstants.js';
import equalityExplorer from '../../equalityExplorer.js';
import BasicsScene from './BasicsScene.js';
import ObjectVariable from './ObjectVariable.js';

class AnimalsScene extends BasicsScene {

  constructor() {

    const variables = [

      // name, image, shadow
      new ObjectVariable( 'dog', dog_png, dogShadow_png, { value: 11 } ),
      new ObjectVariable( 'cat', cat_png, catShadow_png, { value: 4 } ),
      new ObjectVariable( 'turtle', turtle_png, turtleShadow_png, { value: 6 } )
    ];

    super( variables, {

      debugName: 'animals',

      // icon used to represent this scene in the scene control (radio buttons)
      icon: new Image( turtle_png, {
        maxHeight: EqualityExplorerConstants.SMALL_TERM_DIAMETER
      } ),

      // weight at which the scale bottoms out
      maxWeight: 50
    } );
  }
}

equalityExplorer.register( 'AnimalsScene', AnimalsScene );

export default AnimalsScene;