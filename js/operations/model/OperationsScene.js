// Copyright 2017-2020, University of Colorado Boulder

/**
 * The sole scene in the 'Operations' screen.
 * This scene has variable and constant terms on both sides of the equation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ConstantTerm = require( 'EQUALITY_EXPLORER/common/model/ConstantTerm' );
  const ConstantTermCreator = require( 'EQUALITY_EXPLORER/common/model/ConstantTermCreator' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const Emitter = require( 'AXON/Emitter' );
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  const EqualityExplorerScene = require( 'EQUALITY_EXPLORER/common/model/EqualityExplorerScene' );
  const Fraction = require( 'PHETCOMMON/model/Fraction' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const Snapshot = require( 'EQUALITY_EXPLORER/common/model/Snapshot' );
  const StringProperty = require( 'AXON/StringProperty' );
  const TermCreator = require( 'EQUALITY_EXPLORER/common/model/TermCreator' );
  const UniversalOperation = require( 'EQUALITY_EXPLORER/common/model/UniversalOperation' );
  const Variable = require( 'EQUALITY_EXPLORER/common/model/Variable' );
  const VariableTerm = require( 'EQUALITY_EXPLORER/common/model/VariableTerm' );
  const VariableTermCreator = require( 'EQUALITY_EXPLORER/common/model/VariableTermCreator' );

  // string
  const xString = require( 'string!EQUALITY_EXPLORER/x' );

  // constants
  const OPERAND_RANGE = new Range( -10, 10 );
  const ICON_SIZE = new Dimension2(
    EqualityExplorerConstants.BIG_TERM_DIAMETER + 10,
    EqualityExplorerConstants.BIG_TERM_DIAMETER );

  /**
   * @constructor
   */
  function OperationsScene( options ) {

    options = merge( {

      // EqualityExplorerScene options
      debugName: 'operations',
      gridRows: 1,
      gridColumns: 2,
      iconSize: ICON_SIZE // {Dimension2} size of terms icons on the scale
    }, options );

    // @protected
    this.xVariable = new Variable( xString );

    assert && assert( !options.variables, 'OperationsScene sets variables' );
    options.variables = [ this.xVariable ];

    // @public (read-only)
    // emit when one or more terms become zero as the result of a universal operation
    this.sumToZeroEmitter = new Emitter( {
      parameters: [ {

        // {TermCreator[]}
        isValidValue: array => ( Array.isArray( array ) && _.every( array, value => value instanceof TermCreator ) )
      } ]
    } );

    // @public (read-only)
    this.operators = EqualityExplorerConstants.OPERATORS;

    // @public
    this.operatorProperty = new StringProperty( this.operators[ 0 ], {
      validValues: this.operators
    } );

    // @public (read-only) {Term[]} operands that appear in the operand picker.
    // These are the only Terms that are not created and managed by a TermCreator.
    this.operands = [];
    for ( let i = OPERAND_RANGE.min; i <= OPERAND_RANGE.max; i++ ) {

      const constantTermOperand = new ConstantTerm( {
        constantValue: Fraction.fromInteger( i )
      } );

      if ( i === 0 ) {

        // skip variable term with zero coefficient
        this.operands.push( constantTermOperand );
      }
      else {

        const variableTermOperand = new VariableTerm( this.xVariable, {
          coefficient: Fraction.fromInteger( i )
        } );

        if ( i < 0 ) {

          // for negative numbers, put the variable term before the constant term
          // e.g. ... -2x, -2, -x, -1
          this.operands.push( variableTermOperand );
          this.operands.push( constantTermOperand );
        }
        else {

          // for positive numbers, put the variable term before the constant term
          // e.g. 1, x, 2, 2x, ...
          this.operands.push( constantTermOperand );
          this.operands.push( variableTermOperand );
        }
      }
    }

    // Start with operand 1
    const defaultOperand = _.find( this.operands, function( operand ) {
      return ( operand instanceof ConstantTerm ) && ( operand.constantValue.getValue() === 1 );
    } );
    assert && assert( defaultOperand, 'oops, the default was not found' );

    // @private {Property.<Term>}
    this.operandProperty = new Property( defaultOperand, {
      validValues: this.operands
    } );

    // @protected (read-only) emit is called when a universal operation has completed.
    this.operationCompletedEmitter = new Emitter( {
      parameters: [ { valueType: UniversalOperation } ]
    } );

    // Variable and constant terms will combined in specific cells in the plate's grid.
    const variableTermCreatorOptions = {
      likeTermsCell: 0 // cell on the plate that all like terms will occupy
    };
    const constantTermCreatorOptions = {
      likeTermsCell: 1 // cell on the plate that all like terms will occupy
    };

    // @protected
    this.leftVariableTermCreator = new VariableTermCreator( this.xVariable, variableTermCreatorOptions );
    this.leftConstantTermCreator = new ConstantTermCreator( constantTermCreatorOptions );
    this.rightVariableTermCreator = new VariableTermCreator( this.xVariable, variableTermCreatorOptions );
    this.rightConstantTermCreator = new ConstantTermCreator( constantTermCreatorOptions );

    EqualityExplorerScene.call( this,
      [ this.leftVariableTermCreator, this.leftConstantTermCreator ],
      [ this.rightVariableTermCreator, this.rightConstantTermCreator ],
      options );
  }

  equalityExplorer.register( 'OperationsScene', OperationsScene );

  return inherit( EqualityExplorerScene, OperationsScene, {

    /**
     * @public
     * @override
     */
    reset: function() {
      this.xVariable.reset();
      this.operatorProperty.reset();
      this.operandProperty.reset();
      EqualityExplorerScene.prototype.reset.call( this );
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
    },

    /**
     * Applies a universal operation.
     * @param {UniversalOperation} operation
     * @public
     */
    applyOperation: function( operation ) {

      // Take a snapshot of terms on the scale, so we can undo the operation if necessary.
      const snapshot = new Snapshot( this );

      // {TermCreator[]} TermCreators whose term summed to zero as the result of applying this operation.
      const termCreatorsZero = [];

      // Apply the operation to each TermCreator
      this.allTermCreators.forEach( function( termCreator ) {
        const summedToZero = termCreator.applyOperation( operation );
        if ( summedToZero ) {
          termCreatorsZero.push( termCreator );
        }
      } );

      // If any term exceeds maxInteger as the result of applying the operation ...
      const termCreator = this.findMaxIntegerExceeded();
      if ( termCreator ) {

        // Notify listeners and undo the operation by restoring the snapshot.
        termCreator.maxIntegerExceededEmitter.emit();
        snapshot.restore();
      }
      else {

        // Tell the view which terms summed to zero.
        // Do this after the operation has been fully applied, so that sum-to-zero animations
        // appear in the cells at the scale's final position, not at the position before the
        // operation was applied, or at some intermediate position as the operation is being applied.
        if ( termCreatorsZero.length > 0 ) {
          this.sumToZeroEmitter.emit( termCreatorsZero );
        }

        // notify listeners that the operation successfully completed
        this.operationCompletedEmitter.emit( operation );
      }
    },

    /**
     * Finds the first TermCreator that has a Term that exceeds the maxInteger limit.
     * @returns {TermCreator|null}
     * @private
     */
    findMaxIntegerExceeded: function() {
      return _.find( this.allTermCreators, function( termCreator ) {

        // Get the term on the plate
        const term = termCreator.getLikeTermOnPlate();

        // Does the term exceed the limit?
        return term && term.maxIntegerExceeded();
      } );
    }
  } );
} );
