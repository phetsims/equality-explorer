// Copyright 2017-2022, University of Colorado Boulder

/**
 * Model for the 'Operations' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import EqualityExplorerModel from '../../common/model/EqualityExplorerModel.js';
import equalityExplorer from '../../equalityExplorer.js';
import OperationsScene from './OperationsScene.js';

export default class OperationsModel extends EqualityExplorerModel {

  public constructor( tandem: Tandem ) {
    const scenes = [ new OperationsScene( {
      tandem: tandem.createTandem( 'operationScene' )
    } ) ];
    super( scenes, tandem );
  }
}

equalityExplorer.register( 'OperationsModel', OperationsModel );