// Copyright 2017-2022, University of Colorado Boulder

/**
 * Base class for scenes in the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ConstantTermCreator from '../../common/model/ConstantTermCreator.js';
import EqualityExplorerScene, { EqualityExplorerSceneOptions } from '../../common/model/EqualityExplorerScene.js';
import TermCreator from '../../common/model/TermCreator.js';
import equalityExplorer from '../../equalityExplorer.js';
import ObjectTermCreator from './ObjectTermCreator.js';
import ObjectVariable from './ObjectVariable.js';

type SelfOptions = {
  hasConstantTerms?: boolean; // does this scene allow you to create constant terms?
};

type BasicsSceneOptions = SelfOptions & StrictOmit<EqualityExplorerSceneOptions, 'variables' | 'lockable'>;

export default class BasicsScene extends EqualityExplorerScene {

  public constructor( variables: ObjectVariable[], providedOptions: BasicsSceneOptions ) {

    const options = optionize<BasicsSceneOptions, SelfOptions, EqualityExplorerSceneOptions>()( {

      // SelfOptions
      hasConstantTerms: false,

      // EqualityExplorerSceneOptions
      hasNegativeTermsInToolbox: false,
      variables: variables,
      lockable: false
    }, providedOptions );

    const leftTermCreators = createTermCreators( variables, options.hasConstantTerms, options.tandem.createTandem( 'leftTermCreators' ) );
    const rightTermCreators = createTermCreators( variables, options.hasConstantTerms, options.tandem.createTandem( 'rightTermCreators' ) );

    super( leftTermCreators, rightTermCreators, options );
  }
}

function createTermCreators( variables: ObjectVariable[], hasConstantTerms: boolean, parentTandem: Tandem ): TermCreator[] {

  const termCreators: TermCreator[] = [];

  // creators for object terms
  for ( let i = 0; i < variables.length; i++ ) {
    const variable = variables[ i ];
    termCreators.push( new ObjectTermCreator( variable, {
      tandem: parentTandem.createTandem( `${variable.symbol}TermCreator` )
    } ) );
  }

  // creator for constant terms
  if ( hasConstantTerms ) {
    termCreators.push( new ConstantTermCreator( {
      tandem: parentTandem.createTandem( 'constantTermCreator' )
    } ) );
  }

  return termCreators;
}

equalityExplorer.register( 'BasicsScene', BasicsScene );