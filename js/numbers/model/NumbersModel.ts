// Copyright 2017-2022, University of Colorado Boulder

//TODO for single-scene models, should we hide model.numberScene and model.sceneProperty?
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
    //TODO tandem name should somehow use NumbersSceneOptions.tandemNamePrefix
    super( [ new NumbersScene( tandem.createTandem( 'numbersScene' ) ) ], tandem );
  }
}

equalityExplorer.register( 'NumbersModel', NumbersModel );