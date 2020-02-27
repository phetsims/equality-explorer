// Copyright 2017-2019, University of Colorado Boulder

/**
 * Model for the 'Operations' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import EqualityExplorerModel from '../../common/model/EqualityExplorerModel.js';
import equalityExplorer from '../../equalityExplorer.js';
import OperationsScene from './OperationsScene.js';

/**
 * @constructor
 */
function OperationsModel() {
  EqualityExplorerModel.call( this, [ new OperationsScene() ] );
}

equalityExplorer.register( 'OperationsModel', OperationsModel );

inherit( EqualityExplorerModel, OperationsModel );
export default OperationsModel;