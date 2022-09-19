// Copyright 2017-2020, University of Colorado Boulder

// @ts-nocheck
/**
 * Model for the 'Operations' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EqualityExplorerModel from '../../common/model/EqualityExplorerModel.js';
import equalityExplorer from '../../equalityExplorer.js';
import OperationsScene from './OperationsScene.js';

class OperationsModel extends EqualityExplorerModel {

  constructor() {
    super( [ new OperationsScene() ] );
  }
}

equalityExplorer.register( 'OperationsModel', OperationsModel );

export default OperationsModel;