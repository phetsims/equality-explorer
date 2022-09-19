// Copyright 2017-2022, University of Colorado Boulder

/**
 * The sole scene in the 'Variables' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EqualityExplorerConstants from '../../common/EqualityExplorerConstants.js';
import ConstantTermCreator from '../../common/model/ConstantTermCreator.js';
import EqualityExplorerScene from '../../common/model/EqualityExplorerScene.js';
import Variable from '../../common/model/Variable.js';
import VariableTermCreator from '../../common/model/VariableTermCreator.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerStrings from '../../EqualityExplorerStrings.js';

export default class VariablesScene extends EqualityExplorerScene {

  constructor() {

    const xVariable = new Variable( EqualityExplorerStrings.x, {
      range: EqualityExplorerConstants.VARIABLE_RANGE
    } );

    super( createTermCreators( xVariable ), createTermCreators( xVariable ), {
      debugName: 'variables',
      variables: [ xVariable ]
    } );
  }
}

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

equalityExplorer.register( 'VariablesScene', VariablesScene );