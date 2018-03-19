// Copyright 2017-2018, University of Colorado Boulder

//TODO duplication with VariablesScene. Should this be a subtype of VariablesScene?
/**
 * The sole scene in the 'Solving' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ConstantTermCreator = require( 'EQUALITY_EXPLORER/common/model/ConstantTermCreator' );
  var ConstantTermOperand = require( 'EQUALITY_EXPLORER/common/model/ConstantTermOperand' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Emitter = require( 'AXON/Emitter' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var Fraction = require( 'PHETCOMMON/model/Fraction' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var SnapshotWithVariable = require( 'EQUALITY_EXPLORER/common/model/SnapshotWithVariable' );
  var Scene = require( 'EQUALITY_EXPLORER/common/model/Scene' );
  var StringProperty = require( 'AXON/StringProperty' );
  var VariableTermCreator = require( 'EQUALITY_EXPLORER/common/model/VariableTermCreator' );
  var VariableTermOperand = require( 'EQUALITY_EXPLORER/common/model/VariableTermOperand' );

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
  function SolvingScene() {

    // @public (read-only) range of variable 'x'
    this.xRange = EqualityExplorerConstants.VARIABLE_RANGE;

    // @public the value of the variable 'x'
    this.xProperty = new NumberProperty( this.xRange.defaultValue, {
      numberType: 'Integer',
      range: this.xRange
    } );

    // @public (read-only) emit1( sumToZeroData ) when one or more terms become zero as the result of a universal operation
    this.sumToZeroEmitter = new Emitter();

    // @public (read-only)
    this.operators = EqualityExplorerConstants.OPERATORS;

    // @public
    this.operatorProperty = new StringProperty( this.operators[ 0 ], {
      validValues: this.operators
    } );

    //TODO this is a wonky way to specify order and interleaving of variable term operands
    // @public (read-only)
    this.operands = [];
    for ( var i = OPERAND_RANGE.min; i <= OPERAND_RANGE.max; i++ ) {

      // constant term
      var constantTermOperand = new ConstantTermOperand( Fraction.withInteger( i ) );
      this.operands.push( constantTermOperand );

      // variable term, skip zero coefficient
      if ( i !== 0 ) {
        var variableTermOperand = new VariableTermOperand( Fraction.withInteger( i ), xString );
        this.operands.push( variableTermOperand );
      }
    }

    // Start with operand 1
    var defaultOperand = _.find( this.operands, function( operand ) {
      return ( operand instanceof ConstantTermOperand ) && ( operand.constantValue.getValue() === 1 );
    } );
    assert && assert( defaultOperand, 'oops, the default was not found' );

    // @private {Property.<ConstantTermOperator|VariableTermOperator>}
    this.operandProperty = new Property( defaultOperand, {
      validValues: this.operands
    } );

    Scene.call( this, 'solving',
      createTermCreators( this.xProperty ),
      createTermCreators( this.xProperty ), {
        gridRows: 1,
        gridColumns: 2,
        iconSize: ICON_SIZE // {Dimension2} size of terms icons on the scale
      } );
  }

  equalityExplorer.register( 'SolvingScene', SolvingScene );

  /**
   * Creates the term creators for this scene.
   * @param {NumberProperty} xProperty
   * @returns {TermCreator[]}
   */
  function createTermCreators( xProperty ) {

    // x and -x
    var positiveXCreator = new VariableTermCreator( xString, xProperty, {
      defaultCoefficient: Fraction.withInteger( 1 ),
      likeTermsCellIndex: 0
    } );
    var negativeXCreator = new VariableTermCreator( xString, xProperty, {
      defaultCoefficient: Fraction.withInteger( -1 ),
      likeTermsCellIndex: 0
    } );
    positiveXCreator.inverseTermCreator = negativeXCreator;
    negativeXCreator.inverseTermCreator = positiveXCreator;

    // 1 and -1
    var positiveOneCreator = new ConstantTermCreator( {
      defaultConstantValue: Fraction.withInteger( 1 ),
      likeTermsCellIndex: 1
    } );
    var negativeOneCreator = new ConstantTermCreator( {
      defaultConstantValue: Fraction.withInteger( -1 ),
      likeTermsCellIndex: 1
    } );
    positiveOneCreator.inverseTermCreator = negativeOneCreator;
    negativeOneCreator.inverseTermCreator = positiveOneCreator;

    return [ positiveXCreator, negativeXCreator, positiveOneCreator, negativeOneCreator ];
  }

  return inherit( Scene, SolvingScene, {

    /**
     * @public
     * @override
     */
    reset: function() {
      this.xProperty.reset();
      this.operatorProperty.reset();
      this.operandProperty.reset();
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
    },

    /**
     * Applies a universal operation.
     * @param {UniversalOperation} operation
     * @public
     */
    applyOperation: function( operation ) {

      var termCreators = this.leftTermCreators.concat( this.rightTermCreators );

      // Gets all of the terms that are currently on the scale, since applying operations adds/removes terms.
      var terms = [];
      termCreators.forEach( function( termCreator ) {

        // Accumulate terms that are on the plate.
        terms = terms.concat( termCreator.getTermsOnPlate() );

        // Apply the operation to the plate. This may or may not create a term on the plate.
        termCreator.applyOperationToPlate( operation );
      } );

      // Describes the terms that became zero as the result of applying the operation.
      // {{ plate: Plate, cellIndex: number, symbol: string|null }[]}
      var sumToZeroData = [];

      // Apply the operation to terms that were on the scale when this method was called.
      for ( var i = 0; i < terms.length; i++ ) {

        var term = terms[ i ];

        // Determine where the term was, in case it sums to zero
        var plate = term.termCreator.plate;
        var cellIndex = term.termCreator.plate.getCellForTerm( term );
        var symbol = term.symbol || null; // undefined for some term types

        // Apply the operation to the term, returns null if the term became zero.
        var newTerm = term.termCreator.applyOperationToTerm( operation, term );

        // The term became zero, save information needed to perform sum-to-zero animation.
        if ( !newTerm ) {
          sumToZeroData.push( {
            plate: plate, // {Plate} the term was on this plate
            cellIndex: cellIndex, // {number} the term was in this cell in the plate's 2D grid
            symbol: symbol // {string|null} the term had this associated symbol
          } );
        }
      }

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
