// Copyright 2017, University of Colorado Boulder

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
  var LockableScene = require( 'EQUALITY_EXPLORER/common/model/LockableScene' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var SnapshotWithVariable = require( 'EQUALITY_EXPLORER/common/model/SnapshotWithVariable' );
  var TermIcons = require( 'EQUALITY_EXPLORER/common/view/TermIcons' );
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
      range: this.xRange,
      valueType: 'Integer'
    } );

    LockableScene.call( this, 'variables',
      createTermCreators( this.xProperty, EqualityExplorerQueryParameters.leftVariables ),
      createTermCreators( this.xProperty, EqualityExplorerQueryParameters.rightVariables )
    );
  }

  equalityExplorer.register( 'VariablesScene', VariablesScene );

  /**
   * Creates the term creators for this scene.
   * @param {NumberProperty} xProperty
   * @param {number} initialNumberOfTermsOnScale
   * @returns {AbstractTermCreator[]}
   */
  function createTermCreators( xProperty, initialNumberOfTermsOnScale ) {
    assert && assert( initialNumberOfTermsOnScale.length === 4 );
    var index = 0;

    var positiveXCreator = new VariableTermCreator( xString, TermIcons.POSITIVE_X_NODE, TermIcons.X_SHADOW_NODE, {
      weight: xProperty.value,
      initialNumberOfTermsOnScale: initialNumberOfTermsOnScale[ index++ ]
    } );

    var negativeXCreator = new VariableTermCreator( xString, TermIcons.NEGATIVE_X_NODE, TermIcons.X_SHADOW_NODE, {
      weight: -positiveXCreator.weight,
      sign: -positiveXCreator.sign,
      initialNumberOfTermsOnScale: initialNumberOfTermsOnScale[ index++ ]
    } );

    // unlink unnecessary
    xProperty.lazyLink( function( x ) {
      positiveXCreator.weightProperty.value = x;
      negativeXCreator.weightProperty.value = -x;
    } );

    return [
      positiveXCreator,
      negativeXCreator,
      new ConstantTermCreator( TermIcons.POSITIVE_ONE_NODE, TermIcons.ONE_SHADOW_NODE, {
        weight: 1,
        initialNumberOfTermsOnScale: initialNumberOfTermsOnScale[ index++ ]
      } ),
      new ConstantTermCreator( TermIcons.NEGATIVE_ONE_NODE, TermIcons.ONE_SHADOW_NODE, {
        weight: -1,
        initialNumberOfTermsOnScale: initialNumberOfTermsOnScale[ index++ ]
      } )
    ];
  }

  return inherit( LockableScene, VariablesScene, {

    /**
     * @public
     * @override
     */
    reset: function() {
      this.xProperty.reset();
      LockableScene.prototype.reset.call( this );
    },

    /**
     * Saves a snapshot of the scene. Restore is handled by the snapshot.
     * @returns {SnapshotWithVariable}
     * @public
     * @override
     */
    save: function() {
      return new SnapshotWithVariable( this );
    }
  } );
} );
