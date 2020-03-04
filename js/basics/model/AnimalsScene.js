// Copyright 2017-2020, University of Colorado Boulder

/**
 * The 'Animals' scene in the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Image from '../../../../scenery/js/nodes/Image.js';
import catImage from '../../../images/cat_png.js';
import catShadowImage from '../../../images/catShadow_png.js';
import dogImage from '../../../images/dog_png.js';
import dogShadowImage from '../../../images/dogShadow_png.js';
import turtleImage from '../../../images/turtle_png.js';
import turtleShadowImage from '../../../images/turtleShadow_png.js';
import EqualityExplorerConstants from '../../common/EqualityExplorerConstants.js';
import equalityExplorer from '../../equalityExplorer.js';
import BasicsScene from './BasicsScene.js';
import ObjectVariable from './ObjectVariable.js';

class AnimalsScene extends BasicsScene {

  constructor() {

    const variables = [

      // name, image, shadow
      new ObjectVariable( 'dog', dogImage, dogShadowImage, { value: 11 } ),
      new ObjectVariable( 'cat', catImage, catShadowImage, { value: 4 } ),
      new ObjectVariable( 'turtle', turtleImage, turtleShadowImage, { value: 6 } )
    ];

    super( variables, {

      debugName: 'animals',

      // icon used to represent this scene in the scene control (radio buttons)
      icon: new Image( turtleImage, {
        maxHeight: EqualityExplorerConstants.SMALL_TERM_DIAMETER
      } ),

      // weight at which the scale bottoms out
      maxWeight: 50
    } );
  }
}

equalityExplorer.register( 'AnimalsScene', AnimalsScene );

export default AnimalsScene;