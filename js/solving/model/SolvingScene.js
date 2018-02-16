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
  var ConstantTerm2 = require( 'EQUALITY_EXPLORER/common/model/ConstantTerm2' );
  var ConstantTermCreator = require( 'EQUALITY_EXPLORER/common/model/ConstantTermCreator' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LockableScene = require( 'EQUALITY_EXPLORER/common/model/LockableScene' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var ReducedFraction = require( 'EQUALITY_EXPLORER/common/model/ReducedFraction' );
  var SnapshotWithVariable = require( 'EQUALITY_EXPLORER/common/model/SnapshotWithVariable' );
  var StringProperty = require( 'AXON/StringProperty' );
  var TermIcons = require( 'EQUALITY_EXPLORER/common/view/TermIcons' );
  var VariableTermCreator = require( 'EQUALITY_EXPLORER/common/model/VariableTermCreator' );
  var VariableTerm2 = require( 'EQUALITY_EXPLORER/common/model/VariableTerm2' );

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

    // term creators for left side of scale
    var leftPositiveXCreator = new VariableTermCreator( xString, TermIcons.POSITIVE_X_NODE, TermIcons.X_SHADOW_NODE, {
      weight: this.xProperty.value
    } );
    var leftNegativeXCreator = new VariableTermCreator( xString, TermIcons.NEGATIVE_X_NODE, TermIcons.X_SHADOW_NODE, {
      weight: -leftPositiveXCreator.weight,
      sign: -leftPositiveXCreator.sign
    } );
    var leftPositiveOneCreator = new ConstantTermCreator( TermIcons.POSITIVE_ONE_NODE, TermIcons.ONE_SHADOW_NODE, {
      weight: CONSTANT_ITEM_WEIGHT
    } );
    var leftNegativeOneCreator = new ConstantTermCreator( TermIcons.NEGATIVE_ONE_NODE, TermIcons.ONE_SHADOW_NODE, {
      weight: -CONSTANT_ITEM_WEIGHT
    } );

    // term creators for right side of scale
    var rightPositiveXCreator = new VariableTermCreator( xString, TermIcons.POSITIVE_X_NODE, TermIcons.X_SHADOW_NODE, {
      weight: this.xProperty.value
    } );
    var rightNegativeXCreator = new VariableTermCreator( xString, TermIcons.NEGATIVE_X_NODE, TermIcons.X_SHADOW_NODE, {
      weight: -rightPositiveXCreator.weight,
      sign: -rightPositiveXCreator.sign
    } );
    var rightPositiveOneCreator = new ConstantTermCreator( TermIcons.POSITIVE_ONE_NODE, TermIcons.ONE_SHADOW_NODE, {
      weight: CONSTANT_ITEM_WEIGHT
    } );
    var rightNegativeOneCreator = new ConstantTermCreator( TermIcons.NEGATIVE_ONE_NODE, TermIcons.ONE_SHADOW_NODE, {
      weight: -CONSTANT_ITEM_WEIGHT
    } );

    LockableScene.call( this, 'solving',
      [ leftPositiveXCreator, leftNegativeXCreator, leftPositiveOneCreator, leftNegativeOneCreator ],
      [ rightPositiveXCreator, rightNegativeXCreator, rightPositiveOneCreator, rightNegativeOneCreator ], {
        gridRows: 1,
        gridColumns: 2,
        iconSize: new Dimension2( EqualityExplorerConstants.TERM_DIAMETER + 10, EqualityExplorerConstants.TERM_DIAMETER )
      } );

    // update term creator weights when the value of 'x' changes. unlink unnecessary
    this.xProperty.lazyLink( function( x ) {
      leftPositiveXCreator.weightProperty.value = x;
      leftNegativeXCreator.weightProperty.value = -x;
      rightPositiveXCreator.weightProperty.value = x;
      rightNegativeXCreator.weightProperty.value = -x;
    } );

    // @public terms on the left side of the scale
    this.leftVariableTerm = new VariableTerm2( xString, this.xProperty, {
      coefficient: ReducedFraction.ONE,
      location: this.scale.leftPlate.getLocationForCell( 0 )
    } );
    this.leftConstantTerm = new ConstantTerm2( {
      value: ReducedFraction.ONE,
      location: this.scale.leftPlate.getLocationForCell( 1 )
    } );

    // @public terms on the right side of the scale
    this.rightVariableTerm = new VariableTerm2( xString, this.xProperty, {
      coefficient: ReducedFraction.ONE,
      location: this.scale.rightPlate.getLocationForCell( 0 )
    } );
    this.rightConstantTerm = new ConstantTerm2( {
      value: ReducedFraction.ONE,
      location: this.scale.rightPlate.getLocationForCell( 1 )
    } );

    // @public (read-only)
    this.terms = [
      this.leftVariableTerm,
      this.rightVariableTerm,
      this.leftConstantTerm,
      this.rightConstantTerm
    ];
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
      this.leftVariableTerm.reset();
      this.rightVariableTerm.reset();
      this.leftConstantTerm.reset();
      this.rightConstantTerm.reset();

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
