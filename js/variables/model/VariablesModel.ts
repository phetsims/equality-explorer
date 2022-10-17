// Copyright 2017-2022, University of Colorado Boulder

/**
 * Model for the 'Variables' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import EqualityExplorerModel from '../../common/model/EqualityExplorerModel.js';
import equalityExplorer from '../../equalityExplorer.js';
import VariablesScene from './VariablesScene.js';

export default class VariablesModel extends EqualityExplorerModel {

  public constructor( tandem: Tandem ) {
    super( [ new VariablesScene( tandem.createTandem( 'variablesScene' ) ) ], tandem );
  }
}

equalityExplorer.register( 'VariablesModel', VariablesModel );