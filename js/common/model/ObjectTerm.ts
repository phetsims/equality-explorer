// Copyright 2017-2024, University of Colorado Boulder

/**
 * ObjectTerm is a term associated with a type of real-world object (sphere, apple, coin, dog, ...)
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import equalityExplorer from '../../equalityExplorer.js';
import ObjectVariable from './ObjectVariable.js';
import Term from './Term.js';
import UniversalOperation from './UniversalOperation.js';
import Variable from './Variable.js';
import VariableTerm, { VariableTermOptions } from './VariableTerm.js';

// constants
const COEFFICIENT = Fraction.fromInteger( 1 ); // all object terms have an implicit coefficient of 1

type SelfOptions = EmptySelfOptions;

export type ObjectTermOptions = SelfOptions & VariableTermOptions;

export default class ObjectTerm extends VariableTerm {

  public readonly objectVariable: ObjectVariable;

  public constructor( variable: ObjectVariable, providedOptions?: ObjectTermOptions ) {

    const options = optionize<ObjectTermOptions, SelfOptions, VariableTermOptions>()( {
      coefficient: COEFFICIENT
    }, providedOptions );

    super( variable, options );

    this.objectVariable = variable;
  }

  public override getVariable(): Variable | null {
    return this.variable;
  }

  /**
   * For debugging only. Do not rely on the format of toString.
   */
  public override toString(): string {
    return `ObjectTerm: ${this.coefficient} ${this.variable}`;
  }

  /**
   * Creates the options that would be needed to instantiate a copy of this object.
   * ObjectTerm has no SelfOptions, so this is identical to super.copyOptions.
   * We implement this method anyway, just to make that painfully obvious, and in
   * case SelfOptions is augmented in the future.
   */
  public override copyOptions(): ObjectTermOptions {
    return super.copyOptions();
  }

  /**
   * Creates a copy of this term, with modifications through options.
   */
  public override copy( providedOptions?: ObjectTermOptions ): ObjectTerm {
    return new ObjectTerm( this.objectVariable, combineOptions<ObjectTermOptions>( this.copyOptions(), providedOptions ) ); //TODO https://github.com/phetsims/equality-explorer/issues/200 dynamic
  }

  /**
   * Are this term and the specified term 'like terms'?
   * ObjectTerms are 'like' if they are associated with the same variable.
   */
  public override isLikeTerm( term: Term ): boolean {
    return ( term instanceof ObjectTerm ) && ( term.variable === this.variable );
  }

  /**
   * Applies an operation to this term, resulting in a new term.
   * Returns null if the operation is not applicable to this term.
   */
  public override applyOperation( operation: UniversalOperation ): ObjectTerm | null {
    return null; // operations are not applicable to ObjectTerms
  }

  // The implementation of methods plus and minus are inherited from VariableTerm.
}

equalityExplorer.register( 'ObjectTerm', ObjectTerm );