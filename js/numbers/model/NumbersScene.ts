// Copyright 2017-2022, University of Colorado Boulder

/**
 * The sole scene in the 'Numbers' screen.
 * This scene has constant terms only on both sides of the equation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ConstantTermCreator from '../../common/model/ConstantTermCreator.js';
import EqualityExplorerScene from '../../common/model/EqualityExplorerScene.js';
import equalityExplorer from '../../equalityExplorer.js';

export default class NumbersScene extends EqualityExplorerScene {

  public constructor() {
    super( [ new ConstantTermCreator() ], [ new ConstantTermCreator() ], {
      tandemNamePrefix: 'numbers'
    } );
  }
}

equalityExplorer.register( 'NumbersScene', NumbersScene );