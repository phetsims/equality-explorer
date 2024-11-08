// Copyright 2017-2022, University of Colorado Boulder

/**
 * Base class for scenes in the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import optionize from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ConstantTermCreator from '../../common/model/ConstantTermCreator.js';
import EqualityExplorerScene, { EqualityExplorerSceneOptions } from '../../common/model/EqualityExplorerScene.js';
import ObjectTermCreator from '../../common/model/ObjectTermCreator.js';
import ObjectVariable from '../../common/model/ObjectVariable.js';
import TermCreator from '../../common/model/TermCreator.js';
import equalityExplorer from '../../equalityExplorer.js';

type SelfOptions = {
  hasConstantTerms?: boolean; // does this scene allow you to create constant terms?
};

type BasicsSceneOptions = SelfOptions & StrictOmit<EqualityExplorerSceneOptions, 'variables' | 'lockable'>;

export default class BasicsScene extends EqualityExplorerScene {

  /**
   * @param variables - in the order that they appear in the toolbox and equations
   * @param providedOptions
   */
  public constructor( variables: ObjectVariable[], providedOptions: BasicsSceneOptions ) {

    const options = optionize<BasicsSceneOptions, SelfOptions, EqualityExplorerSceneOptions>()( {

      // SelfOptions
      hasConstantTerms: false,

      // EqualityExplorerSceneOptions
      hasNegativeTermsInToolbox: false,
      variables: variables,
      lockable: false
    }, providedOptions );

    const createLeftTermCreators = ( lockedProperty: Property<boolean> | null, tandem: Tandem ) =>
      createTermCreators( variables, lockedProperty, options.hasConstantTerms, tandem );

    const createRightTermCreators = ( lockedProperty: Property<boolean> | null, tandem: Tandem ) =>
      createTermCreators( variables, lockedProperty, options.hasConstantTerms, tandem );

    super( createLeftTermCreators, createRightTermCreators, options );
  }
}

function createTermCreators( variables: ObjectVariable[],
                             lockedProperty: Property<boolean> | null,
                             hasConstantTerms: boolean,
                             parentTandem: Tandem ): TermCreator[] {

  const termCreators: TermCreator[] = [];

  // creators for object terms
  for ( let i = 0; i < variables.length; i++ ) {
    const variable = variables[ i ];
    termCreators.push( new ObjectTermCreator( variable, {
      lockedProperty: lockedProperty,
      tandem: parentTandem.createTandem( `${variable.symbol}TermCreator` )
    } ) );
  }

  // creator for constant terms
  if ( hasConstantTerms ) {
    termCreators.push( new ConstantTermCreator( {
      lockedProperty: lockedProperty,
      tandem: parentTandem.createTandem( 'constantTermCreator' )
    } ) );
  }

  return termCreators;
}

equalityExplorer.register( 'BasicsScene', BasicsScene );