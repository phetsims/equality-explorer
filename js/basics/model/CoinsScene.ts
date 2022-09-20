// Copyright 2017-2022, University of Colorado Boulder

/**
 * The 'Coins' scene in the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Image } from '../../../../scenery/js/imports.js';
import coin1_png from '../../../images/coin1_png.js';
import coin1Shadow_png from '../../../images/coin1Shadow_png.js';
import coin2_png from '../../../images/coin2_png.js';
import coin2Shadow_png from '../../../images/coin2Shadow_png.js';
import coin3_png from '../../../images/coin3_png.js';
import coin3Shadow_png from '../../../images/coin3Shadow_png.js';
import EqualityExplorerConstants from '../../common/EqualityExplorerConstants.js';
import equalityExplorer from '../../equalityExplorer.js';
import BasicsScene from './BasicsScene.js';
import ObjectVariable from './ObjectVariable.js';

export default class CoinsScene extends BasicsScene {

  public constructor() {

    const variables = [

      // name, image, shadow
      new ObjectVariable( 'coin1', coin1_png, coin1Shadow_png, { value: 3 } ),
      new ObjectVariable( 'coin2', coin2_png, coin2Shadow_png, { value: 2 } ),
      new ObjectVariable( 'coin3', coin3_png, coin3Shadow_png, { value: 5 } )
    ];

    super( variables, {

      debugName: 'coins',

      // icon used to represent this scene in the scene control (radio buttons)
      icon: new Image( coin3_png, {
        maxHeight: EqualityExplorerConstants.SMALL_TERM_DIAMETER
      } )
    } );
  }
}

equalityExplorer.register( 'CoinsScene', CoinsScene );