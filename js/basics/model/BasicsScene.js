// Copyright 2017-2018, University of Colorado Boulder

/**
 * Abstract base type for a scene in the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ConstantTermCreator = require( 'EQUALITY_EXPLORER/common/model/ConstantTermCreator' );
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const EqualityExplorerScene = require( 'EQUALITY_EXPLORER/common/model/EqualityExplorerScene' );
  const inherit = require( 'PHET_CORE/inherit' );
  const ObjectTermCreator = require( 'EQUALITY_EXPLORER/basics/model/ObjectTermCreator' );

  /**
   * @param {ObjectVariable[]} variables
   * @param {Object} [options]
   * @constructor
   * @abstract
   */
  function BasicsScene( variables, options ) {

    options = _.extend( {
      hasConstantTerms: false // does this scene allow you to create constant terms?
    }, options );

    assert && assert( !options.variables, 'BasicsScreen sets variables' );
    options.variables = variables;

    // the lock feature is not supported for scenes in the Basics screen
    assert && assert( options.lockable === undefined, 'BasicsScene sets lockable' );
    options.lockable = false;

    EqualityExplorerScene.call( this,
      createTermCreators( variables, options.hasConstantTerms ),
      createTermCreators( variables, options.hasConstantTerms ),
      options );
  }

  equalityExplorer.register( 'BasicsScene', BasicsScene );

  /**
   * Creates the term creators for this scene.
   * @param {ObjectVariable[]} variables - see BasicsScene constructor
   * @param {boolean} hasConstantTerms - does this scene allow you to create constant terms?
   * @returns {TermCreator[]}
   */
  function createTermCreators( variables, hasConstantTerms ) {

    var termCreators = [];

    // creators for object terms
    for ( var i = 0; i < variables.length; i++ ) {
      termCreators.push( new ObjectTermCreator( variables[ i ] ) );
    }

    // creator for constant terms
    if ( hasConstantTerms ) {
      termCreators.push( new ConstantTermCreator() );
    }

    return termCreators;
  }

  return inherit( EqualityExplorerScene, BasicsScene );
} );

