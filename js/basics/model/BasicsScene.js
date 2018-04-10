// Copyright 2017-2018, University of Colorado Boulder

/**
 * Abstract base type for a scene in the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ConstantTermCreator = require( 'EQUALITY_EXPLORER/common/model/ConstantTermCreator' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MysteryTermCreator = require( 'EQUALITY_EXPLORER/basics/model/MysteryTermCreator' );
  var Scene = require( 'EQUALITY_EXPLORER/common/model/Scene' );

  /**
   * @param {MysteryObject[]} mysteryObjects
   * @param {Object} [options]
   * @constructor
   * @abstract
   */
  function BasicsScene( mysteryObjects, options ) {

    options = _.extend( {
      hasConstantTerms: false // does this scene allow you to create constant terms?
    }, options );

    // the lock feature is not supported for scenes in the Basics screen
    assert && assert( options.lockable === undefined, 'BasicsScene sets lockable' );
    options.lockable = false;

    Scene.call( this,
      createTermCreators( mysteryObjects, options.hasConstantTerms ),
      createTermCreators( mysteryObjects, options.hasConstantTerms ),
      options );
  }

  equalityExplorer.register( 'BasicsScene', BasicsScene );

  /**
   * Creates the term creators for this scene.
   * @param {Object[]} mysteryObjects - see BasicsScene constructor
   * @param {boolean} hasConstantTerms - does this scene allow you to create constant terms?
   * @returns {TermCreator[]}
   */
  function createTermCreators( mysteryObjects, hasConstantTerms ) {

    var termCreators = [];

    // creators for mystery terms
    for ( var i = 0; i < mysteryObjects.length; i++ ) {
      termCreators.push( new MysteryTermCreator( mysteryObjects[ i ] ) );
    }

    // creator for constant terms
    if ( hasConstantTerms ) {
      termCreators.push( new ConstantTermCreator() );
    }

    return termCreators;
  }

  return inherit( Scene, BasicsScene );
} );

