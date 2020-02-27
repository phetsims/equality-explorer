// Copyright 2017-2019, University of Colorado Boulder

/**
 * Model for the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import EqualityExplorerModel from '../../common/model/EqualityExplorerModel.js';
import equalityExplorer from '../../equalityExplorer.js';
import AnimalsScene from './AnimalsScene.js';
import CoinsScene from './CoinsScene.js';
import FruitsScene from './FruitsScene.js';
import ShapesScene from './ShapesScene.js';

/**
 * @constructor
 */
function BasicsModel() {
  EqualityExplorerModel.call( this, [

    // in the order that they appear (left to right) in the scene control (radio buttons)
    new ShapesScene(),
    new FruitsScene(),
    new CoinsScene(),
    new AnimalsScene()
  ] );
}

equalityExplorer.register( 'BasicsModel', BasicsModel );

inherit( EqualityExplorerModel, BasicsModel );
export default BasicsModel;