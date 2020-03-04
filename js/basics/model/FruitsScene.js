// Copyright 2017-2020, University of Colorado Boulder

/**
 * The 'Fruits' scene in the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Image from '../../../../scenery/js/nodes/Image.js';
import appleImage from '../../../images/apple_png.js';
import appleShadowImage from '../../../images/appleShadow_png.js';
import lemonImage from '../../../images/lemon_png.js';
import lemonShadowImage from '../../../images/lemonShadow_png.js';
import orangeImage from '../../../images/orange_png.js';
import orangeShadowImage from '../../../images/orangeShadow_png.js';
import EqualityExplorerConstants from '../../common/EqualityExplorerConstants.js';
import equalityExplorer from '../../equalityExplorer.js';
import BasicsScene from './BasicsScene.js';
import ObjectVariable from './ObjectVariable.js';

class FruitsScene extends BasicsScene {

  constructor() {

    const variables = [

      // name, image, shadow
      new ObjectVariable( 'apple', appleImage, appleShadowImage, { value: 4 } ),
      new ObjectVariable( 'lemon', lemonImage, lemonShadowImage, { value: 5 } ),
      new ObjectVariable( 'orange', orangeImage, orangeShadowImage, { value: 2 } )
    ];

    super( variables, {

      debugName: 'fruits',

      // icon used to represent this scene in the scene control (radio buttons)
      icon: new Image( appleImage, {
        maxHeight: EqualityExplorerConstants.SMALL_TERM_DIAMETER
      } )
    } );
  }
}

equalityExplorer.register( 'FruitsScene', FruitsScene );

export default FruitsScene;