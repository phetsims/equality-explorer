// Copyright 2017-2020, University of Colorado Boulder

/**
 * Abstract base type for a scene in the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import ConstantTermCreator from '../../common/model/ConstantTermCreator.js';
import EqualityExplorerScene from '../../common/model/EqualityExplorerScene.js';
import equalityExplorer from '../../equalityExplorer.js';
import ObjectTermCreator from './ObjectTermCreator.js';

class BasicsScene extends EqualityExplorerScene {

  /**
   * @param {ObjectVariable[]} variables
   * @param {Object} [options]
   * @abstract
   */
  constructor( variables, options ) {

    options = merge( {
      hasConstantTerms: false // does this scene allow you to create constant terms?
    }, options );

    assert && assert( !options.variables, 'BasicsScreen sets variables' );
    options.variables = variables;

    // the lock feature is not supported for scenes in the Basics screen
    assert && assert( options.lockable === undefined, 'BasicsScene sets lockable' );
    options.lockable = false;

    super(
      createTermCreators( variables, options.hasConstantTerms ),
      createTermCreators( variables, options.hasConstantTerms ),
      options
    );
  }
}

/**
 * Creates the term creators for this scene.
 * @param {ObjectVariable[]} variables - see BasicsScene constructor
 * @param {boolean} hasConstantTerms - does this scene allow you to create constant terms?
 * @returns {TermCreator[]}
 */
function createTermCreators( variables, hasConstantTerms ) {

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

export default BasicsScene;