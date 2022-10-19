// Copyright 2017-2022, University of Colorado Boulder

/**
 * Model for the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import EqualityExplorerModel from '../../common/model/EqualityExplorerModel.js';
import equalityExplorer from '../../equalityExplorer.js';
import AnimalsScene from './AnimalsScene.js';
import CoinsScene from './CoinsScene.js';
import FruitsScene from './FruitsScene.js';
import ShapesScene from './ShapesScene.js';

export default class BasicsModel extends EqualityExplorerModel {

  public constructor( tandem: Tandem ) {

    const scenesTandem = tandem.createTandem( 'scenes' );

    // in the order that they appear (left to right) in the scene control (radio buttons)
    const scenes = [
      new ShapesScene( scenesTandem.createTandem( 'shapesScene' ) ),
      new FruitsScene( scenesTandem.createTandem( 'fruitScene' ) ),
      new CoinsScene( scenesTandem.createTandem( 'coinsScene' ) ),
      new AnimalsScene( scenesTandem.createTandem( 'animalsScene' ) )
    ];

    super( scenes, tandem );
  }
}

equalityExplorer.register( 'BasicsModel', BasicsModel );