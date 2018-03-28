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
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Scene = require( 'EQUALITY_EXPLORER/common/model/Scene' );
  var SnapshotWithVariable = require( 'EQUALITY_EXPLORER/common/model/SnapshotWithVariable' );
  var VariableTermCreator = require( 'EQUALITY_EXPLORER/common/model/VariableTermCreator' );

  // string
  var xString = require( 'string!EQUALITY_EXPLORER/x' );

  /**
   * @constructor
   */
  function VariablesScene() {

    // @public (read-only) range of variable 'x'
    this.xRange = EqualityExplorerConstants.VARIABLE_RANGE;

    // @public (read-only) the value of the variable 'x'
    this.xProperty = new NumberProperty( this.xRange.defaultValue, {
      numberType: 'Integer',
      range: this.xRange
    } );

    Scene.call( this, 'variables', createTermCreators( this.xProperty ), createTermCreators( this.xProperty ) );
  }

  equalityExplorer.register( 'VariablesScene', VariablesScene );

  /**
   * Creates the term creators for this scene.
   * @param {NumberProperty} xProperty
   * @returns {TermCreator[]}
   */
  function createTermCreators( xProperty ) {

    return [

      // x and -x
      new VariableTermCreator( xString, xProperty ),

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
      this.xProperty.reset();
      Scene.prototype.reset.call( this );
    },

    /**
     * Creates a snapshot of the scene.
     * @returns {SnapshotWithVariable}
     * @public
     * @override
     */
    createSnapshot: function() {
      return new SnapshotWithVariable( this );
    }
  } );
} );
