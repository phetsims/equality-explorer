// Copyright 2017-2020, University of Colorado Boulder

/**
 * The sole scene in the 'Variables' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import EqualityExplorerConstants from '../../common/EqualityExplorerConstants.js';
import ConstantTermCreator from '../../common/model/ConstantTermCreator.js';
import EqualityExplorerScene from '../../common/model/EqualityExplorerScene.js';
import Variable from '../../common/model/Variable.js';
import VariableTermCreator from '../../common/model/VariableTermCreator.js';
import equalityExplorerStrings from '../../equality-explorer-strings.js';
import equalityExplorer from '../../equalityExplorer.js';

// string
const xString = equalityExplorerStrings.x;

/**
 * @constructor
 */
function VariablesScene() {

  const xVariable = new Variable( xString, {
    range: EqualityExplorerConstants.VARIABLE_RANGE
  } );

  EqualityExplorerScene.call( this, createTermCreators( xVariable ), createTermCreators( xVariable ), {
    debugName: 'variables',
    variables: [ xVariable ]
  } );
}

equalityExplorer.register( 'VariablesScene', VariablesScene );

/**
 * Creates the term creators for this scene.
 * @param {Variable} xVariable
 * @returns {TermCreator[]}
 */
function createTermCreators( xVariable ) {

  return [

    // x and -x
    new VariableTermCreator( xVariable ),

    // 1 and -1
    new ConstantTermCreator()
  ];
}

inherit( EqualityExplorerScene, VariablesScene );
export default VariablesScene;