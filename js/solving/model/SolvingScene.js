// Copyright 2017, University of Colorado Boulder

//TODO lots of duplication with VariablesScene
/**
 * The sole scene in the 'Solving' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ConstantItemCreator = require( 'EQUALITY_EXPLORER/common/model/ConstantItemCreator' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemIcons = require( 'EQUALITY_EXPLORER/common/view/ItemIcons' );
  var LockableScene = require( 'EQUALITY_EXPLORER/common/model/LockableScene' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var SnapshotWithVariable = require( 'EQUALITY_EXPLORER/common/model/SnapshotWithVariable' );
  var StringProperty = require( 'AXON/StringProperty' );
  var VariableItemCreator = require( 'EQUALITY_EXPLORER/common/model/VariableItemCreator' );

  // string
  var xString = require( 'string!EQUALITY_EXPLORER/x' );

  /**
   * @constructor
   */
  function SolvingScene() {

    // @public (read-only) range of variable 'x'
    this.xRange = EqualityExplorerConstants.X_RANGE;

    // @public (read-only) the value of the variable 'x'
    this.xProperty = new NumberProperty( this.xRange.defaultValue, {
      range: this.xRange,
      valueType: 'Integer'
    } );

    // @public (read-only) set of operators for universal operation
    this.operators = [
      EqualityExplorerConstants.PLUS,
      EqualityExplorerConstants.MINUS,
      EqualityExplorerConstants.TIMES,
      EqualityExplorerConstants.DIVIDE
    ];

    // @public (read-only) operator for 'universal operation'
    this.operatorProperty = new StringProperty( EqualityExplorerConstants.PLUS, {
      validValues: this.operators
    } );

    // @public (read-only) range for universal operand
    this.operandRange = new RangeWithValue( -10, 10, 1 );

    // @public (read-only) universal operand
    this.operandProperty = new NumberProperty( this.operandRange.defaultValue, {
      range: this.operandRange,
      valueType: 'Integer'
    } );

    LockableScene.call( this, 'solving', createItemCreators( this.xProperty ), createItemCreators( this.xProperty ) );
  }

  equalityExplorer.register( 'SolvingScene', SolvingScene );

  /**
   * Creates the item creators for this scene.
   * @param {NumberProperty} xProperty
   * @returns {AbstractItemCreator[]}
   */
  function createItemCreators( xProperty ) {

    var positiveXCreator = new VariableItemCreator( xString, ItemIcons.POSITIVE_X_NODE, ItemIcons.X_SHADOW_NODE, {
      weight: xProperty.value
    } );

    var negativeXCreator = new VariableItemCreator( xString, ItemIcons.NEGATIVE_X_NODE, ItemIcons.X_SHADOW_NODE, {
      weight: -positiveXCreator.weight,
      sign: -positiveXCreator.sign
    } );

    // unlink unnecessary
    xProperty.lazyLink( function( x ) {
      positiveXCreator.weightProperty.value = x;
      negativeXCreator.weightProperty.value = -x;
    } );

    return [
      positiveXCreator,
      negativeXCreator,
      new ConstantItemCreator( ItemIcons.POSITIVE_ONE_NODE, ItemIcons.ONE_SHADOW_NODE, {
        weight: 1
      } ),
      new ConstantItemCreator( ItemIcons.NEGATIVE_ONE_NODE, ItemIcons.ONE_SHADOW_NODE, {
        weight: -1
      } )
    ];
  }

  return inherit( LockableScene, SolvingScene, {

    /**
     * @public
     * @override
     */
    reset: function() {
      this.xProperty.reset();
      this.operatorProperty.reset();
      this.operandProperty.reset();
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
