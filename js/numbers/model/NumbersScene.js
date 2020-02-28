// Copyright 2017-2020, University of Colorado Boulder

/**
 * The sole scene in the 'Numbers' screen.
 * This scene has constant terms only on both sides of the equation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import ConstantTermCreator from '../../common/model/ConstantTermCreator.js';
import EqualityExplorerScene from '../../common/model/EqualityExplorerScene.js';
import equalityExplorer from '../../equalityExplorer.js';

/**
 * @constructor
 */
function NumbersScene() {
  EqualityExplorerScene.call( this, [ new ConstantTermCreator() ], [ new ConstantTermCreator() ], {
    debugName: 'numbers'
  } );
}

equalityExplorer.register( 'NumbersScene', NumbersScene );

inherit( EqualityExplorerScene, NumbersScene );
export default NumbersScene;