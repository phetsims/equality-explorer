// Copyright 2017-2022, University of Colorado Boulder

/**
 * ObjectTerm is a term associated with a type of real-world object (sphere, apple, coin, dog, ...)
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import Term, { TermOptions } from '../../common/model/Term.js';
import equalityExplorer from '../../equalityExplorer.js';
import ObjectVariable from './ObjectVariable.js';
import Variable from '../../common/model/Variable.js';
import UniversalOperation from '../../common/model/UniversalOperation.js';

// constants
const COEFFICIENT = Fraction.fromInteger( 1 ); // all object terms have an implicit coefficient of 1

type SelfOptions = EmptySelfOptions;

type ObjectTermOptions = SelfOptions & TermOptions;

export default class ObjectTerm extends Term {

  public readonly variable: ObjectVariable;

  public constructor( variable: ObjectVariable, providedOptions?: ObjectTermOptions ) {

    super( COEFFICIENT, providedOptions );

    this.variable = variable;
  }

  public override getVariable(): Variable | null {
    return this.variable;
  }

  /**
   * For debugging only. Do not rely on the format of toString.
   */
  public override toString(): string {
    return `ObjectTerm: ${this.variable.symbolProperty.value} ${this.variable.valueProperty.value}`;
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

  //-------------------------------------------------------------------------------------------------
  // Below here is the implementation of the abstract methods of the Term API
  //-------------------------------------------------------------------------------------------------

  /**
   * Creates a copy of this term, with modifications through options.
   */
  public override copy( providedOptions?: ObjectTermOptions ): ObjectTerm {
    return new ObjectTerm( this.variable,
      combineOptions<ObjectTermOptions>( this.copyOptions(), providedOptions ) );
  }

  /**
   * Gets the weight of this term.
   */
  public override get weight(): Fraction {
    return Fraction.fromInteger( this.variable.valueProperty.value );
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
   * @returns null if the operation is not applicable to this term.
   */
  public override applyOperation( operation: UniversalOperation, providedOptions?: ObjectTermOptions ): ObjectTerm | null {
    return null; // operations are not applicable to these terms
  }
}

equalityExplorer.register( 'ObjectTerm', ObjectTerm );