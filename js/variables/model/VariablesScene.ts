// Copyright 2017-2022, University of Colorado Boulder

/**
 * The sole scene in the 'Variables' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import EqualityExplorerConstants from '../../common/EqualityExplorerConstants.js';
import ConstantTermCreator from '../../common/model/ConstantTermCreator.js';
import EqualityExplorerScene from '../../common/model/EqualityExplorerScene.js';
import TermCreator from '../../common/model/TermCreator.js';
import Variable from '../../common/model/Variable.js';
import VariableTermCreator from '../../common/model/VariableTermCreator.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerStrings from '../../EqualityExplorerStrings.js';

export default class VariablesScene extends EqualityExplorerScene {

  public constructor( tandem: Tandem ) {

    const xVariable = new Variable( EqualityExplorerStrings.xStringProperty, {
      range: EqualityExplorerConstants.VARIABLE_RANGE
    } );

    const leftTermCreators = createTermCreators( xVariable, tandem.createTandem( 'leftTermCreators' ) );
    const rightTermCreators = createTermCreators( xVariable, tandem.createTandem( 'rightTermCreators' ) );

    super( leftTermCreators, rightTermCreators, {
      variables: [ xVariable ],
      tandem: tandem
    } );
  }
}

/**
 * Creates the term creators for this scene.
 */
function createTermCreators( xVariable: Variable, parentTandem: Tandem ): TermCreator[] {

  return [

    // x and -x
    new VariableTermCreator( xVariable, {
      tandem: parentTandem.createTandem( 'variableTermCreator' )
    } ),

    // 1 and -1
    new ConstantTermCreator( {
      tandem: parentTandem.createTandem( 'constantTermCreator' )
    } )
  ];
}

equalityExplorer.register( 'VariablesScene', VariablesScene );