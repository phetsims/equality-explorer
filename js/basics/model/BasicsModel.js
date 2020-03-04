// Copyright 2017-2020, University of Colorado Boulder

/**
 * Model for the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EqualityExplorerModel from '../../common/model/EqualityExplorerModel.js';
import equalityExplorer from '../../equalityExplorer.js';
import AnimalsScene from './AnimalsScene.js';
import CoinsScene from './CoinsScene.js';
import FruitsScene from './FruitsScene.js';
import ShapesScene from './ShapesScene.js';

class BasicsModel extends EqualityExplorerModel {

  constructor() {
    super( [

      // in the order that they appear (left to right) in the scene control (radio buttons)
      new ShapesScene(),
      new FruitsScene(),
      new CoinsScene(),
      new AnimalsScene()
    ] );
  }
}

equalityExplorer.register( 'BasicsModel', BasicsModel );

export default BasicsModel;