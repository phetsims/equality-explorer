// Copyright 2017-2020, University of Colorado Boulder

/**
 * Base class for scenes in the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
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

  public constructor( variables: ObjectVariable[], providedOptions?: BasicsSceneOptions ) {

    const options = optionize<BasicsSceneOptions, SelfOptions, EqualityExplorerSceneOptions>()( {

      // SelfOptions
      hasConstantTerms: false,

      // EqualityExplorerSceneOptions
      variables: variables,
      lockable: false
    }, providedOptions );

    super(
      createTermCreators( variables, options.hasConstantTerms ),
      createTermCreators( variables, options.hasConstantTerms ),
      options
    );
  }
}

function createTermCreators( variables: ObjectVariable[], hasConstantTerms: boolean ): TermCreator[] {

  const termCreators = [];

  // creators for object terms
  for ( let i = 0; i < variables.length; i++ ) {
    termCreators.push( new ObjectTermCreator( variables[ i ] ) );
  }

  // creator for constant terms
  if ( hasConstantTerms ) {
    termCreators.push( new ConstantTermCreator() );
  }

  return termCreators;
}

equalityExplorer.register( 'BasicsScene', BasicsScene );