// Copyright 2017-2018, University of Colorado Boulder

/**
 * Base type for a scene in the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ConstantTermCreator = require( 'EQUALITY_EXPLORER/common/model/ConstantTermCreator' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MysteryTermCreator = require( 'EQUALITY_EXPLORER/basics/model/MysteryTermCreator' );
  var ReducedFraction = require( 'EQUALITY_EXPLORER/common/model/ReducedFraction' );
  var Scene = require( 'EQUALITY_EXPLORER/common/model/Scene' );

  /**
   * @param {string} debugName - internal name, not displayed to the user, no i18n required
   * @param {Node} icon - icon used to represent the scene
   * @param {{name: string, weight: number, icon: Node, shadow: Node}[]} mysteryObjects
   * @param {Object} [options]
   * @constructor
   */
  function BasicsScene( debugName, icon, mysteryObjects, options ) {

    options = _.extend( {
      hasConstantTerms: false // does this scene allow you to create constant terms?
    }, options );

    assert && assert( !options.icon, 'icon is a required parameter for BasicsScene' );
    options.icon = icon;

    Scene.call( this, debugName,
      createTermCreators( mysteryObjects, options.hasConstantTerms, EqualityExplorerQueryParameters.leftBasics ),
      createTermCreators( mysteryObjects, options.hasConstantTerms, EqualityExplorerQueryParameters.rightBasics ),
      options );
  }

  equalityExplorer.register( 'BasicsScene', BasicsScene );

  /**
   * Creates the term creators for this scene.
   * @param {Object[]} mysteryObjects - see BasicsScene constructor
   * @param {boolean} hasConstantTerms - does this scene allow you to create constant terms?
   * @param {number[]} initialNumberOfTermsOnScale
   * @returns {TermCreator[]}
   */
  function createTermCreators( mysteryObjects, hasConstantTerms, initialNumberOfTermsOnScale ) {

    var termCreators = [];

    // creators for mystery terms
    for ( var i = 0; i < mysteryObjects.length; i++ ) {
      var o = mysteryObjects[ i ];
      termCreators.push( new MysteryTermCreator( o.name, o.weight, o.icon, o.shadow, {
        initialNumberOfTermsOnScale: initialNumberOfTermsOnScale[ i ]
      } ) );
    }

    // creator for constant terms
    if ( hasConstantTerms ) {
      termCreators.push( new ConstantTermCreator( {
          defaultValue: ReducedFraction.withInteger( 1 ),
          initialNumberOfTermsOnScale: initialNumberOfTermsOnScale[ i ]
        } )
      );
    }

    return termCreators;
  }

  return inherit( Scene, BasicsScene );
} );

