// Copyright 2017-2022, University of Colorado Boulder

/**
 * The sole scene in the 'Operations' screen.
 * This scene has variable and constant terms on both sides of the equation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import EqualityExplorerConstants from '../../common/EqualityExplorerConstants.js';
import ConstantTerm from '../../common/model/ConstantTerm.js';
import ConstantTermCreator from '../../common/model/ConstantTermCreator.js';
import EqualityExplorerScene, { EqualityExplorerSceneOptions } from '../../common/model/EqualityExplorerScene.js';
import Snapshot from '../../common/model/Snapshot.js';
import TermCreator from '../../common/model/TermCreator.js';
import UniversalOperation, { UniversalOperand } from '../../common/model/UniversalOperation.js';
import Variable from '../../common/model/Variable.js';
import VariableTerm from '../../common/model/VariableTerm.js';
import VariableTermCreator from '../../common/model/VariableTermCreator.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerStrings from '../../EqualityExplorerStrings.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import UniversalOperator from '../../common/model/UniversalOperator.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';

// constants
const OPERAND_RANGE = EqualityExplorerConstants.OPERAND_RANGE;
const ICON_SIZE = new Dimension2(
  EqualityExplorerConstants.BIG_TERM_DIAMETER + 10,
  EqualityExplorerConstants.BIG_TERM_DIAMETER );

type SelfOptions = {
  variableRange?: Range | null; // range of the variables
};

export type OperationsSceneOptions = SelfOptions &
  PickOptional<EqualityExplorerSceneOptions, 'scalePosition' | 'lockable'> &
  PickRequired<EqualityExplorerSceneOptions, 'tandem'>;

export default class OperationsScene extends EqualityExplorerScene {

  protected readonly x: Variable;

  // emits when one or more terms become zero as the result of a universal operation
  public readonly sumToZeroEmitter: Emitter<[ TermCreator[] ]>;

  // emits is called when a universal operation has completed.
  protected readonly operationCompletedEmitter: Emitter<[ UniversalOperation ]>;

  public readonly operators: readonly UniversalOperator[];
  public readonly operatorProperty: Property<UniversalOperator>;

  // operands that appear in the operand picker. These are the only Terms that are not created and managed by a TermCreator.
  public readonly operands: UniversalOperand[];
  public readonly operandProperty: Property<UniversalOperand>;

  public constructor( providedOptions: OperationsSceneOptions ) {

    const options = optionize<OperationsSceneOptions, SelfOptions, EqualityExplorerSceneOptions>()( {

      // SelfOptions
      variableRange: EqualityExplorerConstants.VARIABLE_RANGE,

      // EqualityExplorerSceneOptions
      gridRows: 1,
      gridColumns: 2,
      iconSize: ICON_SIZE // {Dimension2} size of terms icons on the scale
    }, providedOptions );

    const variablesTandem = options.tandem.createTandem( 'variables' );

    const x = new Variable( EqualityExplorerStrings.xStringProperty, {
      range: options.variableRange,
      tandem: variablesTandem.createTandem( 'x' )
    } );
    options.variables = [ x ];

    const createLeftTermCreators = ( lockedProperty: Property<boolean> | null, tandem: Tandem ) =>
      createTermCreators( x, lockedProperty, tandem );

    const createRightTermCreators = ( lockedProperty: Property<boolean> | null, tandem: Tandem ) =>
      createTermCreators( x, lockedProperty, tandem );

    super( createLeftTermCreators, createRightTermCreators, options );

    this.x = x;

    this.sumToZeroEmitter = new Emitter( {
      parameters: [ {

        // {TermCreator[]}
        isValidValue: array => ( Array.isArray( array ) && _.every( array, value => value instanceof TermCreator ) )
      } ]
    } );

    this.operators = UniversalOperator.enumeration.values;

    this.operatorProperty = new EnumerationProperty( this.operators[ 0 ], {
      validValues: this.operators
    } );

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

        const variableTermOperand = new VariableTerm( this.x, {
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
    const defaultOperand = _.find( this.operands,
      operand => ( operand instanceof ConstantTerm ) && ( operand.constantValue.getValue() === 1 ) )!;
    assert && assert( defaultOperand, 'oops, the default was not found' );

    this.operandProperty = new Property( defaultOperand, {
      validValues: this.operands
    } );

    this.operationCompletedEmitter = new Emitter( {
      parameters: [ { valueType: UniversalOperation } ]
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public override reset(): void {
    this.x.reset();
    this.operatorProperty.reset();
    this.operandProperty.reset();
    super.reset();
  }

  /**
   * Applies a universal operation.
   */
  public applyOperation( operation: UniversalOperation ): void {

    // Take a snapshot of terms on the scale, so we can undo the operation if necessary.
    const snapshot = new Snapshot( this ); //TODO https://github.com/phetsims/equality-explorer/issues/200 dynamic

    // TermCreators whose terms summed to zero as the result of applying this operation.
    const termCreatorsZero: TermCreator[] = [];

    // Apply the operation to each TermCreator
    this.allTermCreators.forEach( termCreator => {
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
  }

  /**
   * Finds the first TermCreator that has a Term that exceeds the maxInteger limit.
   */
  private findMaxIntegerExceeded(): TermCreator | null {
    const termCreator = _.find( this.allTermCreators, termCreator => {

      // Get the term on the plate
      const term = termCreator.getLikeTermOnPlate();

      // Does the term exceed the limit?
      return ( term !== null ) && term.maxIntegerExceeded();
    } );
    return termCreator || null;
  }
}

/**
 * Creates the term creators for this scene.
 */
function createTermCreators( x: Variable, lockedProperty: Property<boolean> | null, parentTandem: Tandem ): TermCreator[] {

  // Variable and constant terms will be combined in specific cells in the plate's grid.
  // This is the cell in the grid that all like terms will occupy.
  let likeTermsCell = 0;

  return [

    // x & -x
    new VariableTermCreator( x, {
        likeTermsCell: likeTermsCell++,
        lockedProperty: lockedProperty,
        tandem: parentTandem.createTandem( 'xTermCreator' )
      } ),

    // 1 & -1
    new ConstantTermCreator( {
      likeTermsCell: likeTermsCell++,
      lockedProperty: lockedProperty,
      tandem: parentTandem.createTandem( 'constantTermCreator' )
    } )
  ];
}

equalityExplorer.register( 'OperationsScene', OperationsScene );