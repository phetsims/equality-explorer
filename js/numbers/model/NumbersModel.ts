// Copyright 2017-2020, University of Colorado Boulder

// @ts-nocheck
/**
 * Model for the 'Numbers' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EqualityExplorerModel from '../../common/model/EqualityExplorerModel.js';
import equalityExplorer from '../../equalityExplorer.js';
import NumbersScene from './NumbersScene.js';

class NumbersModel extends EqualityExplorerModel {

  constructor() {
    super( [ new NumbersScene() ] );
  }
}

equalityExplorer.register( 'NumbersModel', NumbersModel );

export default NumbersModel;