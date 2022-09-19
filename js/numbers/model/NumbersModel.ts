// Copyright 2017-2020, University of Colorado Boulder

/**
 * Model for the 'Numbers' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EqualityExplorerModel from '../../common/model/EqualityExplorerModel.js';
import equalityExplorer from '../../equalityExplorer.js';
import NumbersScene from './NumbersScene.js';

export default class NumbersModel extends EqualityExplorerModel<NumbersScene> {

  public constructor() {
    super( [ new NumbersScene() ] );
  }
}

equalityExplorer.register( 'NumbersModel', NumbersModel );