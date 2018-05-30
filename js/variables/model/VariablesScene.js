// Copyright 2017-2018, University of Colorado Boulder

/**
 * The sole scene in the 'Variables' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ConstantTermCreator = require( 'EQUALITY_EXPLORER/common/model/ConstantTermCreator' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerScene = require( 'EQUALITY_EXPLORER/common/model/EqualityExplorerScene' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Variable = require( 'EQUALITY_EXPLORER/common/model/Variable' );
  var VariableTermCreator = require( 'EQUALITY_EXPLORER/common/model/VariableTermCreator' );

  // string
  var xString = require( 'string!EQUALITY_EXPLORER/x' );

  /**
   * @constructor
   */
  function VariablesScene() {

    var xVariable = new Variable( xString );

    EqualityExplorerScene.call( this, createTermCreators( xVariable ), createTermCreators( xVariable ), {
      debugName: 'variables',
      variables: [ xVariable ]
    } );
  }

  equalityExplorer.register( 'VariablesScene', VariablesScene );

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

  return inherit( EqualityExplorerScene, VariablesScene );
} );
