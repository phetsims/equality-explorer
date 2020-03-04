// Copyright 2017-2020, University of Colorado Boulder

/**
 * The 'Shapes' scene in the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import sphereImage from '../../../images/sphere_png.js';
import sphereShadowImage from '../../../images/sphereShadow_png.js';
import squareImage from '../../../images/square_png.js';
import squareShadowImage from '../../../images/squareShadow_png.js';
import ConstantTermNode from '../../common/view/ConstantTermNode.js';
import equalityExplorer from '../../equalityExplorer.js';
import BasicsScene from './BasicsScene.js';
import ObjectVariable from './ObjectVariable.js';

class ShapesScene extends BasicsScene {

  constructor() {

    const variables = [

      // name, image, shadow
      new ObjectVariable( 'sphere', sphereImage, sphereShadowImage, { value: 2 } ),
      new ObjectVariable( 'square', squareImage, squareShadowImage, { value: 3 } )
    ];

    super( variables, {

      debugName: 'shapes',

      // icon used to represent this scene in the scene control (radio buttons)
      icon: ConstantTermNode.createInteractiveTermNode( Fraction.fromInteger( 1 ) ),

      // this scene allows you to create constant terms
      hasConstantTerms: true
    } );
  }
}

equalityExplorer.register( 'ShapesScene', ShapesScene );

export default ShapesScene;