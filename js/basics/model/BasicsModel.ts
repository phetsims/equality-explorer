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
    super( [

      // in the order that they appear (left to right) in the scene control (radio buttons)
      new ShapesScene(),
      new FruitsScene(),
      new CoinsScene(),
      new AnimalsScene()
    ], tandem );
  }
}

equalityExplorer.register( 'BasicsModel', BasicsModel );