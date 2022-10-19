// Copyright 2017-2022, University of Colorado Boulder

/**
 * The sole scene in the 'Variables' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
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

    const variablesTandem = tandem.createTandem( 'variables' );

    const xVariable = new Variable( EqualityExplorerStrings.xStringProperty, {
      range: EqualityExplorerConstants.VARIABLE_RANGE,
      tandem: variablesTandem.createTandem( 'xVariable' )
    } );

    const createLeftTermCreators = ( lockedProperty: Property<boolean> | null, tandem: Tandem ) =>
      createTermCreators( xVariable, lockedProperty, tandem );

    const createRightTermCreators = ( lockedProperty: Property<boolean> | null, tandem: Tandem ) =>
      createTermCreators( xVariable, lockedProperty, tandem );

    super( createLeftTermCreators, createRightTermCreators, {
      variables: [ xVariable ],
      tandem: tandem
    } );
  }
}

/**
 * Creates the term creators for this scene.
 */
function createTermCreators( xVariable: Variable, lockedProperty: Property<boolean> | null, parentTandem: Tandem ): TermCreator[] {

  return [

    // x and -x
    new VariableTermCreator( xVariable, {
      lockedProperty: lockedProperty,
      tandem: parentTandem.createTandem( 'xTermCreator' )
    } ),

    // 1 and -1
    new ConstantTermCreator( {
      lockedProperty: lockedProperty,
      tandem: parentTandem.createTandem( 'constantTermCreator' )
    } )
  ];
}

equalityExplorer.register( 'VariablesScene', VariablesScene );