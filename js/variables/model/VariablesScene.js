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
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var ReducedFraction = require( 'EQUALITY_EXPLORER/common/model/ReducedFraction' );
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

    Scene.call( this, 'variables',
      createTermCreators( this.xProperty, EqualityExplorerQueryParameters.leftVariables ),
      createTermCreators( this.xProperty, EqualityExplorerQueryParameters.rightVariables )
    );
  }

  equalityExplorer.register( 'VariablesScene', VariablesScene );

  /**
   * Creates the term creators for this scene.
   * @param {NumberProperty} xProperty
   * @param {number} initialNumberOfTermsOnPlate
   * @returns {TermCreator[]}
   */
  function createTermCreators( xProperty, initialNumberOfTermsOnPlate ) {

    assert && assert( initialNumberOfTermsOnPlate.length === 4,
      'incorrect number of elements in initialNumberOfTermsOnPlate: ' + initialNumberOfTermsOnPlate.length );
    var index = 0;

    return [

      // x
      new VariableTermCreator( xString, xProperty, {
        defaultCoefficient: ReducedFraction.withInteger( 1 ),
        initialNumberOfTermsOnPlate: initialNumberOfTermsOnPlate[ index++ ]
      } ),

      // -x
      new VariableTermCreator( xString, xProperty, {
        defaultCoefficient: ReducedFraction.withInteger( -1 ),
        initialNumberOfTermsOnPlate: initialNumberOfTermsOnPlate[ index++ ]
      } ),

      // 1
      new ConstantTermCreator( {
        defaultConstantValue: ReducedFraction.withInteger( 1 ),
        initialNumberOfTermsOnPlate: initialNumberOfTermsOnPlate[ index++ ]
      } ),

      // -1
      new ConstantTermCreator( {
        defaultConstantValue: ReducedFraction.withInteger( -1 ),
        initialNumberOfTermsOnPlate: initialNumberOfTermsOnPlate[ index++ ]
      } )
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
