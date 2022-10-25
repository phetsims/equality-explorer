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
import Tandem from '../../../../tandem/js/Tandem.js';

export default class CoinsScene extends BasicsScene {

  public constructor( tandem: Tandem ) {

    const variablesTandem = tandem.createTandem( 'variables' );

    //TODO https://github.com/phetsims/equality-explorer/issues/191 better tandem names for coins?
    const variables = [

      // coin1
      new ObjectVariable( {
        symbol: 'coin1',
        image: coin1_png,
        shadow: coin1Shadow_png,
        value: 3,
        tandem: variablesTandem.createTandem( 'coin1' )
      } ),

      // coin2
      new ObjectVariable( {
        symbol: 'coin2',
        image: coin2_png,
        shadow: coin2Shadow_png,
        value: 2,
        tandem: variablesTandem.createTandem( 'coin2' )
      } ),

      // coin3
      new ObjectVariable( {
        symbol: 'coin3',
        image: coin3_png,
        shadow: coin3Shadow_png,
        value: 5,
        tandem: variablesTandem.createTandem( 'coin3' )
      } )
    ];

    super( variables, {

      // icon used to represent this scene in the scene control (radio buttons)
      icon: new Image( coin3_png, {
        maxHeight: EqualityExplorerConstants.SMALL_TERM_DIAMETER
      } ),

      tandem: tandem
    } );
  }
}

equalityExplorer.register( 'CoinsScene', CoinsScene );