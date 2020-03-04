// Copyright 2017-2020, University of Colorado Boulder

/**
 * The 'Coins' scene in the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Image from '../../../../scenery/js/nodes/Image.js';
import coin1Image from '../../../images/coin1_png.js';
import coin1ShadowImage from '../../../images/coin1Shadow_png.js';
import coin2Image from '../../../images/coin2_png.js';
import coin2ShadowImage from '../../../images/coin2Shadow_png.js';
import coin3Image from '../../../images/coin3_png.js';
import coin3ShadowImage from '../../../images/coin3Shadow_png.js';
import EqualityExplorerConstants from '../../common/EqualityExplorerConstants.js';
import equalityExplorer from '../../equalityExplorer.js';
import BasicsScene from './BasicsScene.js';
import ObjectVariable from './ObjectVariable.js';

class CoinsScene extends BasicsScene {

  constructor() {

    const variables = [

      // name, image, shadow
      new ObjectVariable( 'coin1', coin1Image, coin1ShadowImage, { value: 3 } ),
      new ObjectVariable( 'coin2', coin2Image, coin2ShadowImage, { value: 2 } ),
      new ObjectVariable( 'coin3', coin3Image, coin3ShadowImage, { value: 5 } )
    ];

    super( variables, {

      debugName: 'coins',

      // icon used to represent this scene in the scene control (radio buttons)
      icon: new Image( coin3Image, {
        maxHeight: EqualityExplorerConstants.SMALL_TERM_DIAMETER
      } )
    } );
  }
}

equalityExplorer.register( 'CoinsScene', CoinsScene );

export default CoinsScene;