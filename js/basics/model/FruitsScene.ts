// Copyright 2017-2022, University of Colorado Boulder

/**
 * The 'Fruits' scene in the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Image } from '../../../../scenery/js/imports.js';
import apple_png from '../../../images/apple_png.js';
import appleShadow_png from '../../../images/appleShadow_png.js';
import lemon_png from '../../../images/lemon_png.js';
import lemonShadow_png from '../../../images/lemonShadow_png.js';
import orange_png from '../../../images/orange_png.js';
import orangeShadow_png from '../../../images/orangeShadow_png.js';
import EqualityExplorerConstants from '../../common/EqualityExplorerConstants.js';
import equalityExplorer from '../../equalityExplorer.js';
import BasicsScene from './BasicsScene.js';
import ObjectVariable from './ObjectVariable.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class FruitsScene extends BasicsScene {

  public constructor( tandem: Tandem ) {

    const variables = [

      // name, image, shadow
      new ObjectVariable( 'apple', apple_png, appleShadow_png, { value: 4 } ),
      new ObjectVariable( 'lemon', lemon_png, lemonShadow_png, { value: 5 } ),
      new ObjectVariable( 'orange', orange_png, orangeShadow_png, { value: 2 } )
    ];

    super( variables, {

      tandemNamePrefix: 'fruits',

      // icon used to represent this scene in the scene control (radio buttons)
      icon: new Image( apple_png, {
        maxHeight: EqualityExplorerConstants.SMALL_TERM_DIAMETER
      } ),

      tandem: tandem
    } );
  }
}

equalityExplorer.register( 'FruitsScene', FruitsScene );