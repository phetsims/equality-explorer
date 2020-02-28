// Copyright 2017-2020, University of Colorado Boulder

/**
 * Model for the 'Variables' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import EqualityExplorerModel from '../../common/model/EqualityExplorerModel.js';
import equalityExplorer from '../../equalityExplorer.js';
import VariablesScene from './VariablesScene.js';

/**
 * @constructor
 */
function VariablesModel() {
  EqualityExplorerModel.call( this, [ new VariablesScene() ] );
}

equalityExplorer.register( 'VariablesModel', VariablesModel );

inherit( EqualityExplorerModel, VariablesModel );
export default VariablesModel;