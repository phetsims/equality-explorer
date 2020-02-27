// Copyright 2017-2019, University of Colorado Boulder

/**
 * Model for the 'Numbers' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import EqualityExplorerModel from '../../common/model/EqualityExplorerModel.js';
import equalityExplorer from '../../equalityExplorer.js';
import NumbersScene from './NumbersScene.js';

/**
 * @constructor
 */
function NumbersModel() {
  EqualityExplorerModel.call( this, [ new NumbersScene() ] );
}

equalityExplorer.register( 'NumbersModel', NumbersModel );

inherit( EqualityExplorerModel, NumbersModel );
export default NumbersModel;