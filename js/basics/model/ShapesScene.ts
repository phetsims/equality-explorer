// Copyright 2017-2022, University of Colorado Boulder

/**
 * The 'Shapes' scene in the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import sphere_png from '../../../images/sphere_png.js';
import sphereShadow_png from '../../../images/sphereShadow_png.js';
import square_png from '../../../images/square_png.js';
import squareShadow_png from '../../../images/squareShadow_png.js';
import ConstantTermNode from '../../common/view/ConstantTermNode.js';
import equalityExplorer from '../../equalityExplorer.js';
import BasicsScene from './BasicsScene.js';
import ObjectVariable from './ObjectVariable.js';

export default class ShapesScene extends BasicsScene {

  public constructor() {

    const variables = [

      // name, image, shadow
      new ObjectVariable( 'sphere', sphere_png, sphereShadow_png, { value: 2 } ),
      new ObjectVariable( 'square', square_png, squareShadow_png, { value: 3 } )
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