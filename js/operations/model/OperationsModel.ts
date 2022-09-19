// Copyright 2017-2020, University of Colorado Boulder

/**
 * Model for the 'Operations' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import EqualityExplorerModel from '../../common/model/EqualityExplorerModel.js';
import equalityExplorer from '../../equalityExplorer.js';
import OperationsScene from './OperationsScene.js';

export default class OperationsModel extends EqualityExplorerModel<OperationsScene> {

  public constructor( tandem: Tandem ) {
    super( [ new OperationsScene() ], tandem );
  }
}

equalityExplorer.register( 'OperationsModel', OperationsModel );