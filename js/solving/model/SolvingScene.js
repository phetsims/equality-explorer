// Copyright 2017, University of Colorado Boulder

//TODO some duplication with VariablesScene. Should this be a subtype of VariablesScene?
/**
 * The sole scene in the 'Solving' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BigConstantItem = require( 'EQUALITY_EXPLORER/common/model/BigConstantItem' );
  var BigVariableItem = require( 'EQUALITY_EXPLORER/common/model/BigVariableItem' );
  var ConstantItemCreator = require( 'EQUALITY_EXPLORER/common/model/ConstantItemCreator' );
  var Dimension2 = require( 'DOT/Dimension2' );
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

  // constants
  var CONSTANT_ITEM_WEIGHT = 1;

  /**
   * @constructor
   */
  function SolvingScene() {

    // @public (read-only) range of variable 'x'
    this.xRange = EqualityExplorerConstants.VARIABLE_RANGE;

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

    // item creators for left side of scale
    var leftPositiveXCreator = new VariableItemCreator( xString, ItemIcons.POSITIVE_X_NODE, ItemIcons.X_SHADOW_NODE, {
      weight: this.xProperty.value
    } );
    var leftNegativeXCreator = new VariableItemCreator( xString, ItemIcons.NEGATIVE_X_NODE, ItemIcons.X_SHADOW_NODE, {
      weight: -leftPositiveXCreator.weight,
      sign: -leftPositiveXCreator.sign
    } );
    var leftPositiveOneCreator = new ConstantItemCreator( ItemIcons.POSITIVE_ONE_NODE, ItemIcons.ONE_SHADOW_NODE, {
      weight: CONSTANT_ITEM_WEIGHT
    } );
    var leftNegativeOneCreator = new ConstantItemCreator( ItemIcons.NEGATIVE_ONE_NODE, ItemIcons.ONE_SHADOW_NODE, {
      weight: -CONSTANT_ITEM_WEIGHT
    } );

    // item creators for right side of scale
    var rightPositiveXCreator = new VariableItemCreator( xString, ItemIcons.POSITIVE_X_NODE, ItemIcons.X_SHADOW_NODE, {
      weight: this.xProperty.value
    } );
    var rightNegativeXCreator = new VariableItemCreator( xString, ItemIcons.NEGATIVE_X_NODE, ItemIcons.X_SHADOW_NODE, {
      weight: -rightPositiveXCreator.weight,
      sign: -rightPositiveXCreator.sign
    } );
    var rightPositiveOneCreator = new ConstantItemCreator( ItemIcons.POSITIVE_ONE_NODE, ItemIcons.ONE_SHADOW_NODE, {
      weight: CONSTANT_ITEM_WEIGHT
    } );
    var rightNegativeOneCreator = new ConstantItemCreator( ItemIcons.NEGATIVE_ONE_NODE, ItemIcons.ONE_SHADOW_NODE, {
      weight: -CONSTANT_ITEM_WEIGHT
    } );

    // update item creator weights when the value of 'x' changes. unlink unnecessary
    this.xProperty.lazyLink( function( x ) {
      leftPositiveXCreator.weightProperty.value = x;
      leftNegativeXCreator.weightProperty.value = -x;
      rightPositiveXCreator.weightProperty.value = x;
      rightNegativeXCreator.weightProperty.value = -x;
    } );

    // @public big items on the left and right sides of the scale
    this.leftVariableItem = new BigVariableItem( xString, this.xProperty, leftPositiveXCreator, leftNegativeXCreator );
    this.rightVariableItem = new BigVariableItem( xString, this.xProperty, rightPositiveXCreator, rightNegativeXCreator );
    this.leftConstantItem = new BigConstantItem( leftPositiveOneCreator, leftNegativeOneCreator );
    this.rightConstantItem = new BigConstantItem( rightPositiveOneCreator, rightNegativeOneCreator );

    LockableScene.call( this, 'solving',
      [ leftPositiveXCreator, leftNegativeXCreator, leftPositiveOneCreator, leftNegativeOneCreator ],
      [ rightPositiveXCreator, rightNegativeXCreator, rightPositiveOneCreator, rightNegativeOneCreator ], {
        gridRows: 1,
        gridColumns: 2,
        iconSize: new Dimension2( 120, 120 )
      } );
  }

  equalityExplorer.register( 'SolvingScene', SolvingScene );

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
