// Copyright 2017-2018, University of Colorado Boulder

/**
 * The sole scene in the 'Operations' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ConstantTerm = require( 'EQUALITY_EXPLORER/common/model/ConstantTerm' );
  var ConstantTermCreator = require( 'EQUALITY_EXPLORER/common/model/ConstantTermCreator' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Emitter = require( 'AXON/Emitter' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var Fraction = require( 'PHETCOMMON/model/Fraction' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var Scene = require( 'EQUALITY_EXPLORER/common/model/Scene' );
  var Snapshot = require( 'EQUALITY_EXPLORER/common/model/Snapshot' );
  var StringProperty = require( 'AXON/StringProperty' );
  var Variable = require( 'EQUALITY_EXPLORER/common/model/Variable' );
  var VariableTerm = require( 'EQUALITY_EXPLORER/common/model/VariableTerm' );
  var VariableTermCreator = require( 'EQUALITY_EXPLORER/common/model/VariableTermCreator' );

  // string
  var xString = require( 'string!EQUALITY_EXPLORER/x' );

  // constants
  var OPERAND_RANGE = new Range( -10, 10 );
  var ICON_SIZE = new Dimension2(
    EqualityExplorerConstants.BIG_TERM_DIAMETER + 10,
    EqualityExplorerConstants.BIG_TERM_DIAMETER );

  /**
   * @constructor
   */
  function OperationsScene() {

    // @public (read-only)
    this.xVariable = new Variable( xString );

    // @public (read-only) emit1( sumToZeroData ) when one or more terms become zero as the result of a universal operation
    this.sumToZeroEmitter = new Emitter();

    // @public (read-only)
    this.operators = EqualityExplorerConstants.OPERATORS;

    // @public
    this.operatorProperty = new StringProperty( this.operators[ 0 ], {
      validValues: this.operators
    } );

    // @public (read-only) {Term[]} operands that appear in the operand picker.
    // These are the only Terms that are not created and managed by a TermCreator.
    this.operands = [];
    for ( var i = OPERAND_RANGE.min; i <= OPERAND_RANGE.max; i++ ) {

      var constantTermOperand = new ConstantTerm( {
        constantValue: Fraction.fromInteger( i )
      } );

      if ( i === 0 ) {

        // skip variable term with zero coefficient
        this.operands.push( constantTermOperand );
      }
      else {

        var variableTermOperand = new VariableTerm( this.xVariable, {
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
    var defaultOperand = _.find( this.operands, function( operand ) {
      return ( operand instanceof ConstantTerm ) && ( operand.constantValue.getValue() === 1 );
    } );
    assert && assert( defaultOperand, 'oops, the default was not found' );

    // @private {Property.<Term>}
    this.operandProperty = new Property( defaultOperand, {
      validValues: this.operands
    } );

    Scene.call( this, 'operations',
      createTermCreators( this.xVariable ),
      createTermCreators( this.xVariable ), {
        gridRows: 1,
        gridColumns: 2,
        iconSize: ICON_SIZE // {Dimension2} size of terms icons on the scale
      } );
  }

  equalityExplorer.register( 'OperationsScene', OperationsScene );

  /**
   * Creates the term creators for this scene.
   * @param {Variable} xVariable
   * @returns {TermCreator[]}
   */
  function createTermCreators( xVariable ) {

    return [

      // x and -x
      new VariableTermCreator( xVariable, {
        likeTermsCellIndex: 0 // cell on the plate that all like terms will occupy
      } ),

      // 1 and -1
      new ConstantTermCreator( {
        likeTermsCellIndex: 1 // cell on the plate that all like terms will occupy
      } )
    ];
  }

  return inherit( Scene, OperationsScene, {

    /**
     * @public
     * @override
     */
    reset: function() {
      this.xVariable.reset();
      this.operatorProperty.reset();
      this.operandProperty.reset();
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
    },

    /**
     * Applies a universal operation.
     * @param {UniversalOperation} operation
     * @public
     */
    applyOperation: function( operation ) {

      // Describes the terms that became zero as the result of applying the operation.
      // {{ plate: Plate, cellIndex: number, symbol: string|null }[]}
      var sumToZeroData = [];

      this.leftTermCreators.concat( this.rightTermCreators ).forEach( function( termCreator ) {

        // Get all of the terms that are currently on the scale, since applying operations adds/removes terms.
        var terms = termCreator.getTermsOnPlate();

        // Apply the operation to the plate.  This may create terms on the plate.
        // For example, applying operation '+ 2' to an empty plate will create a '+2' constant term on the plate.
        termCreator.applyOperationToPlate( operation );

        // Apply the operation to terms that were on the scale when this method was called.
        for ( var i = 0; i < terms.length; i++ ) {

          var term = terms[ i ];

          // Get info about the term, in case it sums to zero and is disposed.
          var cellIndex = termCreator.plate.getCellForTerm( term );
          var symbol = ( term instanceof VariableTerm ) ? term.variable.symbol : null;

          // Apply the operation to the term, returns null if the term became zero.
          var newTerm = termCreator.applyOperationToTerm( operation, term );

          // The term became zero, save information needed to perform sum-to-zero animation.
          if ( !newTerm ) {
            sumToZeroData.push( {
              plate: termCreator.plate, // {Plate} the term was on this plate
              cellIndex: cellIndex, // {number} the term was in this cell in the plate's 2D grid
              symbol: symbol // {string|null} the term had this associated symbol
            } );
          }
        }
      } );

      // Tell the view which terms summed to zero.
      // Do this after the operation has been fully applied, so that sum-to-zero animations
      // appear in the cells at the scale's final position, not at the position before the
      // operation was applied, or at some intermediate location as the operation is being applied.
      if ( sumToZeroData.length > 0 ) {
        this.sumToZeroEmitter.emit1( sumToZeroData );
      }
    }
  } );
} );
