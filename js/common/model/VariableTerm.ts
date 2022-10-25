// Copyright 2018-2022, University of Colorado Boulder

/**
 * Term whose value is a coefficient times some variable value.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerConstants from '../EqualityExplorerConstants.js';
import ConstantTerm from './ConstantTerm.js';
import Term, { TermOptions } from './Term.js';
import UniversalOperation from './UniversalOperation.js';
import Variable from './Variable.js';
import UniversalOperator from './UniversalOperator.js';

type SelfOptions = {
  coefficient?: Fraction;
};

export type VariableTermOptions = SelfOptions & TermOptions;

export default class VariableTerm extends Term {

  public readonly coefficient: Fraction;
  public readonly variable: Variable;

  /**
   * @param variable - the variable for this term, e.g. 'x'
   * @param [providedOptions]
   */
  public constructor( variable: Variable, providedOptions?: VariableTermOptions ) {

    const options = optionize<VariableTermOptions, SelfOptions, TermOptions>()( {

      // SelfOptions
      coefficient: EqualityExplorerConstants.DEFAULT_COEFFICIENT
    }, providedOptions );

    assert && assert( options.coefficient.isReduced(), `coefficient must be reduced: ${options.coefficient}` );

    super( options.coefficient, options );

    this.coefficient = options.coefficient;
    this.variable = variable;
  }

  public override getVariable(): Variable | null {
    return this.variable;
  }

  /**
   * For debugging only. Do not rely on the format of toString.
   */
  public override toString(): string {
    return `VariableTerm: ${this.coefficient} ${this.variable}`;
  }

  /**
   * Creates the options that would be needed to instantiate a copy of this object.
   */
  public override copyOptions(): VariableTermOptions {
    return combineOptions<VariableTermOptions>( {}, super.copyOptions(), {
      coefficient: this.coefficient
    } );
  }

  //-------------------------------------------------------------------------------------------------
  // Below here is the implementation of the abstract methods of the Term API
  //-------------------------------------------------------------------------------------------------

  /**
   * Creates a copy of this term, with modifications through options.
   */
  public override copy( providedOptions?: VariableTermOptions ): VariableTerm {
    return new VariableTerm( this.variable, combineOptions<VariableTermOptions>( {}, this.copyOptions(), providedOptions ) ); //TODO dynamic
  }

  /**
   * Gets the weight of this term.
   */
  public override get weight(): Fraction {
    return this.coefficient.timesInteger( this.variable.valueProperty.value ).reduced();
  }

  /**
   * Are this term and the specified term 'like terms'?
   * Variable terms are 'like' if they are associated with the same variable.
   */
  public override isLikeTerm( term: Term ): boolean {
    return ( term instanceof VariableTerm ) && ( term.variable === this.variable );
  }

  /**
   * Creates a snapshot of this term.
   * A snapshot consists of options that can be passed to the Term's constructor to re-create the Term.
   */
  public override createSnapshot(): VariableTermOptions {
    return combineOptions<VariableTermOptions>( {}, super.createSnapshot(), {
      coefficient: this.coefficient
    } );
  }

  /**
   * Applies an operation to this term, resulting in a new term.
   * Returns null if the operation is not applicable to this term.
   */
  public applyOperation( operation: UniversalOperation, providedOptions?: VariableTermOptions ): VariableTerm | null {

    let term = null;

    if ( operation.operand instanceof VariableTerm ) {

      // plus or minus a constant
      if ( operation.operator === UniversalOperator.PLUS ) {
        term = this.plus( operation.operand, providedOptions );
      }
      else if ( operation.operator === UniversalOperator.MINUS ) {
        term = this.minus( operation.operand, providedOptions );
      }
    }
    else if ( operation.operand instanceof ConstantTerm ) {

      // times or divide by a variable
      if ( operation.operator === UniversalOperator.TIMES ) {
        term = this.times( operation.operand, providedOptions );
      }
      else if ( operation.operator === UniversalOperator.DIVIDE ) {
        term = this.divided( operation.operand, providedOptions );
      }
    }

    return term;
  }

  /**
   * Adds a variable term to this term to create a new term.
   */
  public override plus( term: VariableTerm, providedOptions?: VariableTermOptions ): VariableTerm {
    assert && assert( this.isLikeTerm( term ), `not a like term: ${term}` );
    return this.copy( combineOptions<VariableTermOptions>( {
      coefficient: this.coefficient.plus( term.coefficient ).reduced()
    }, providedOptions ) );
  }

  /**
   * Subtracts a variable term from this term to create a new term.
   */
  public override minus( term: VariableTerm, providedOptions?: VariableTermOptions ): VariableTerm {
    assert && assert( this.isLikeTerm( term ), `not a like term: ${term}` );
    return this.copy( combineOptions<VariableTermOptions>( {
      coefficient: this.coefficient.minus( term.coefficient ).reduced()
    }, providedOptions ) );
  }

  /**
   * Multiplies this term by a constant term to create a new term.
   */
  public override times( term: ConstantTerm, providedOptions?: VariableTermOptions ): VariableTerm {
    return this.copy( combineOptions<VariableTermOptions>( {
      coefficient: this.coefficient.times( term.constantValue ).reduced()
    }, providedOptions ) );
  }

  /**
   * Divides this term by a constant term to create a new term.
   */
  public override divided( term: ConstantTerm, providedOptions?: VariableTermOptions ): VariableTerm {
    assert && assert( term.constantValue.getValue() !== 0, 'attempt to divide by zero' );
    return this.copy( combineOptions<VariableTermOptions>( {
      coefficient: this.coefficient.divided( term.constantValue ).reduced()
    }, providedOptions ) );
  }
}

equalityExplorer.register( 'VariableTerm', VariableTerm );