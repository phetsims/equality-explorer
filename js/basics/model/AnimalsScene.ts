// Copyright 2017-2022, University of Colorado Boulder

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
import ObjectVariable from '../../common/model/ObjectVariable.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class AnimalsScene extends BasicsScene {

  public constructor( tandem: Tandem ) {

    const variablesTandem = tandem.createTandem( 'variables' );

    const variables = [

      // dog
      new ObjectVariable( {
        image: dog_png,
        shadow: dogShadow_png,
        value: 11,
        tandem: variablesTandem.createTandem( 'dog' )
      } ),

      // cat
      new ObjectVariable( {
        image: cat_png,
        shadow: catShadow_png,
        value: 4,
        tandem: variablesTandem.createTandem( 'cat' )
      } ),

      // turtle
      new ObjectVariable( {
        image: turtle_png,
        shadow: turtleShadow_png,
        value: 6,
        tandem: variablesTandem.createTandem( 'turtle' )
      } )
    ];

    super( variables, {

      // icon used to represent this scene in the scene control (radio buttons)
      icon: new Image( turtle_png, {
        maxHeight: EqualityExplorerConstants.SMALL_TERM_DIAMETER
      } ),

      // weight at which the scale bottoms out
      maxWeight: 50,

      tandem: tandem
    } );
  }
}

equalityExplorer.register( 'AnimalsScene', AnimalsScene );