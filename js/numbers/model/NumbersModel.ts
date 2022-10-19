// Copyright 2017-2022, University of Colorado Boulder

/**
 * Model for the 'Numbers' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import EqualityExplorerModel from '../../common/model/EqualityExplorerModel.js';
import equalityExplorer from '../../equalityExplorer.js';
import NumbersScene from './NumbersScene.js';

export default class NumbersModel extends EqualityExplorerModel {

  public constructor( tandem: Tandem ) {

    const scenes = [
      new NumbersScene( tandem.createTandem( 'numbersScene' ) )
    ];

    super( scenes, tandem );
  }
}

equalityExplorer.register( 'NumbersModel', NumbersModel );