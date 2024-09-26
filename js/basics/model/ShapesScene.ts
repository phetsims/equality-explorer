// Copyright 2017-2023, University of Colorado Boulder

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
import ConstantTermNode from '../../common/view/ConstantTermNode.js'; // eslint-disable-line phet/no-view-imported-from-model
import equalityExplorer from '../../equalityExplorer.js';
import BasicsScene from './BasicsScene.js';
import ObjectVariable from '../../common/model/ObjectVariable.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class ShapesScene extends BasicsScene {

  public constructor( tandem: Tandem ) {

    const variablesTandem = tandem.createTandem( 'variables' );

    const variables = [

      // sphere
      new ObjectVariable( {
        image: sphere_png,
        shadow: sphereShadow_png,
        value: 2,
        tandem: variablesTandem.createTandem( 'sphere' )
      } ),

      // square
      new ObjectVariable( {
        image: square_png,
        shadow: squareShadow_png,
        value: 3,
        tandem: variablesTandem.createTandem( 'square' )
      } )
    ];

    super( variables, {

      // icon used to represent this scene in the scene control (radio buttons)
      icon: ConstantTermNode.createInteractiveTermNode( Fraction.fromInteger( 1 ) ),

      // this scene allows you to create constant terms
      hasConstantTerms: true,

      tandem: tandem
    } );
  }
}

equalityExplorer.register( 'ShapesScene', ShapesScene );