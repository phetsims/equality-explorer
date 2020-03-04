// Copyright 2017-2020, University of Colorado Boulder

/**
 * Model for the 'Variables' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EqualityExplorerModel from '../../common/model/EqualityExplorerModel.js';
import equalityExplorer from '../../equalityExplorer.js';
import VariablesScene from './VariablesScene.js';

class VariablesModel extends EqualityExplorerModel {

  constructor() {
    super( [ new VariablesScene() ] );
  }
}

equalityExplorer.register( 'VariablesModel', VariablesModel );

export default VariablesModel;