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
  var inherit = require( 'PHET_CORE/inherit' );
  var Scene = require( 'EQUALITY_EXPLORER/common/model/Scene' );
  var Snapshot = require( 'EQUALITY_EXPLORER/common/model/Snapshot' );
  var Variable = require( 'EQUALITY_EXPLORER/common/model/Variable' );
  var VariableTermCreator = require( 'EQUALITY_EXPLORER/common/model/VariableTermCreator' );

  // string
  var xString = require( 'string!EQUALITY_EXPLORER/x' );

  /**
   * @constructor
   */
  function VariablesScene() {

    // @public (read-only)
    this.xVariable = new Variable( xString );

    //TODO this is repeated in OperationsScene and XYScene
    // @public (read-only)
    this.variables = [ this.xVariable ];

    Scene.call( this, createTermCreators( this.xVariable ), createTermCreators( this.xVariable ), {
      debugName: 'variables'
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

  return inherit( Scene, VariablesScene, {

    /**
     * @public
     * @override
     */
    reset: function() {
      this.xVariable.reset();
      Scene.prototype.reset.call( this );
    },

    /**
     * Creates a snapshot of the scene.
     * @returns {Snapshot}
     * @public
     * @override
     */
    createSnapshot: function() {
      return new Snapshot( this, {
        variables: [ this.xVariable ]
      } );
    }
  } );
} );
