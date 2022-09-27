// Copyright 2018-2022, University of Colorado Boulder

/**
 * Term whose value is a constant.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerConstants from '../EqualityExplorerConstants.js';
import Term, { TermOptions } from './Term.js';
import UniversalOperation from './UniversalOperation.js';
import Variable from './Variable.js';

type SelfOptions = {
  constantValue?: Fraction;
};

type ConstantTermOptions = SelfOptions & TermOptions;

export default class ConstantTerm extends Term {

  public readonly constantValue: Fraction;

  public constructor( providedOptions?: ConstantTermOptions ) {

    const options = optionize<ConstantTermOptions, SelfOptions, TermOptions>()( {

      // SelfOptions
      constantValue: EqualityExplorerConstants.DEFAULT_CONSTANT_VALUE
    }, providedOptions );

    assert && assert( options.constantValue.isReduced(), `constantValue must be reduced: ${options.constantValue}` );

    super( options.constantValue, options );

    this.constantValue = options.constantValue;
  }

  /**
   * Constant terms do not have an associated variable.
   */
  public override getVariable(): Variable | null {
    return null;
  }

  /**
   * For debugging only. Do not rely on the format of toString.
   */
  public override toString(): string {
    return `ConstantTerm: ${this.constantValue}`;
  }

  /**
   * Creates the options that would be needed to instantiate a copy of this object.
   */
  public override copyOptions(): ConstantTermOptions {
    return combineOptions<ConstantTermOptions>( {}, super.copyOptions(), {
      constantValue: this.constantValue
    } );
  }

  //-------------------------------------------------------------------------------------------------
  // Below here is the implementation of the abstract methods of the Term API
  //-------------------------------------------------------------------------------------------------

  /**
   * Creates a copy of this term, with modifications through options.
   */
  public override copy( providedOptions?: ConstantTermOptions ): ConstantTerm {
    return new ConstantTerm( combineOptions<ConstantTermOptions>( this.copyOptions(), providedOptions ) );
  }

  /**
   * The weight of a constant term is the same as its value.
   */
  public override get weight(): Fraction {
    return this.constantValue;
  }

  /**
   * Are this term and the specified term 'like terms'? All constant terms are like terms.
   */
  public override isLikeTerm( term: Term ): boolean {
    return ( term instanceof ConstantTerm );
  }

  /**
   * Creates a snapshot of this term.
   * A snapshot consists of options that can be passed to the Term's constructor to re-create the Term.
   */
  public override createSnapshot(): ConstantTermOptions {
    return combineOptions<ConstantTermOptions>( {}, super.createSnapshot(), {
      constantValue: this.constantValue
    } );
  }

  /**
   * Applies an operation to this term, resulting in a new term.
   * Returns null if the operation is not applicable to this term.
   */
  public override applyOperation( operation: UniversalOperation, providedOptions?: ConstantTermOptions ): ConstantTerm | null {

    let term = null;

    // constant operands only
    if ( operation.operand instanceof ConstantTerm ) {

      if ( operation.operator === MathSymbols.PLUS ) {
        term = this.plus( operation.operand, providedOptions );
      }
      else if ( operation.operator === MathSymbols.MINUS ) {
        term = this.minus( operation.operand, providedOptions );
      }
      else if ( operation.operator === MathSymbols.TIMES ) {
        term = this.times( operation.operand, providedOptions );
      }
      else if ( operation.operator === MathSymbols.DIVIDE ) {
        term = this.divided( operation.operand, providedOptions );
      }
    }

    return term;
  }

  /**
   * Adds a term to this term to create a new term.
   */
  public override plus( term: ConstantTerm, providedOptions?: StrictOmit<ConstantTermOptions, 'constantValue'> ): ConstantTerm {
    return this.copy( combineOptions<ConstantTermOptions>( {
      constantValue: this.constantValue.plus( term.constantValue ).reduce()
    }, providedOptions ) );
  }

  /**
   * Subtracts a term from this term to create a new term.
   */
  public override minus( term: ConstantTerm, providedOptions?: StrictOmit<ConstantTermOptions, 'constantValue'> ): ConstantTerm {
    return this.copy( combineOptions<ConstantTermOptions>( {
      constantValue: this.constantValue.minus( term.constantValue ).reduce()
    }, providedOptions ) );
  }

  /**
   * Multiplies this term by another term to create a new term.
   */
  public override times( term: ConstantTerm, providedOptions?: StrictOmit<ConstantTermOptions, 'constantValue'> ): ConstantTerm {
    return this.copy( combineOptions<ConstantTermOptions>( {
      constantValue: this.constantValue.times( term.constantValue ).reduce()
    }, providedOptions ) );
  }

  /**
   * Divides this term by another term to create a new term.
   */
  public override divided( term: ConstantTerm, providedOptions?: StrictOmit<ConstantTermOptions, 'constantValue'> ): ConstantTerm {
    assert && assert( term.constantValue.getValue() !== 0, 'attempt to divide by zero' );
    return this.copy( combineOptions<ConstantTermOptions>( {
      constantValue: this.constantValue.divided( term.constantValue ).reduce()
    }, providedOptions ) );
  }
}

equalityExplorer.register( 'ConstantTerm', ConstantTerm );