// Copyright 2017-2022, University of Colorado Boulder

/**
 * Term is the abstract base type for all terms.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerConstants from '../EqualityExplorerConstants.js';
import EqualityExplorerQueryParameters from '../EqualityExplorerQueryParameters.js';
import EqualityExplorerMovable, { EqualityExplorerMovableOptions } from './EqualityExplorerMovable.js';
import UniversalOperation from './UniversalOperation.js';
import Variable from './Variable.js';

type SelfOptions = {
  diameter?: number;
  pickable?: boolean; // whether the term is pickable (interactive)
  toolboxPosition?: Vector2 | null; // position of the associated TermCreatorNode in the toolbox
};

export type TermOptions = SelfOptions & EqualityExplorerMovableOptions;

export default abstract class Term extends EqualityExplorerMovable {

  // The value that is significant for the purposes of determining sign and maxInteger limits.
  // The value that is significant is specific to the Term subtype.
  public readonly significantValue: Fraction;

  // Sign of the term's significant number, ala Math.sign.
  // Note that sign is not related to the term's weight. For example, for variable terms, the 'significant number'
  // is the coefficient. Consider term '-5x', where x=-2. While the weight is 10 (-5 * -2), the sign is based on
  // the coefficient -5, and is therefore -1.
  public readonly sign: number;

  // diameter of the term in the view, convenient to store in the model
  public readonly diameter: number;

  // position of this term's corresponding TermCreatorNode in the toolbox
  public toolboxPosition: Vector2 | null;

  // whether the term is pickable (interactive)
  public readonly pickableProperty: Property<boolean>;

  // whether the term is on a plate
  public readonly onPlateProperty: Property<boolean>;

  // whether the term's shadow is visible
  public readonly shadowVisibleProperty: Property<boolean>;

  // whether the term's halo is visible
  public readonly haloVisibleProperty: Property<boolean>;

  /**
   * @param significantValue - significant for the purposes of determining sign and maxInteger limits
   * @param [providedOptions]
   */
  protected constructor( significantValue: Fraction, providedOptions?: TermOptions ) {

    assert && assert( significantValue.isReduced(), `significantValue must be reduced: ${significantValue}` );

    const options = optionize<TermOptions, SelfOptions, EqualityExplorerMovableOptions>()( {

      // SelfOptions
      diameter: EqualityExplorerConstants.SMALL_TERM_DIAMETER,
      pickable: true,
      toolboxPosition: null
    }, providedOptions );

    super( options );

    this.significantValue = significantValue;
    this.sign = Math.sign( significantValue.getValue() );
    this.diameter = options.diameter;
    this.toolboxPosition = options.toolboxPosition;
    this.pickableProperty = new BooleanProperty( options.pickable );
    this.onPlateProperty = new BooleanProperty( false );
    this.shadowVisibleProperty = new BooleanProperty( false );
    this.haloVisibleProperty = new BooleanProperty( false );
  }

  /**
   * Creates the options that would be needed to instantiate a copy of this object.
   * This is used by subtypes that implement copy.
   */
  public override copyOptions(): TermOptions {
    return combineOptions<TermOptions>( {
      diameter: this.diameter
      //TODO https://github.com/phetsims/equality-explorer/issues/186 why are other TermOptions not included here?
    }, super.copyOptions() );
  }

  public override dispose(): void {
    this.pickableProperty.dispose();
    this.onPlateProperty.dispose();
    this.shadowVisibleProperty.dispose();
    this.haloVisibleProperty.dispose();
    super.dispose();
  }

  /**
   * Is this term the inverse of a specified term?
   * Inverse terms are like terms whose significant value has opposite signs. E.g. x and -x, 1 and -1.
   */
  public isInverseTerm( term: Term ): boolean {
    return ( this.isLikeTerm( term ) && ( this.significantValue.plus( term.significantValue ).getValue() === 0 ) );
  }

  /**
   * Is this term equivalent to a specified term?
   * Equivalent terms are like terms with the same significant value.
   */
  public isEquivalentTerm( term: Term ): boolean {
    return ( this.isLikeTerm( term ) && this.significantValue.reduced().equals( term.significantValue.reduced() ) );
  }

  /**
   * Does this term have a numerator or denominator who absolute value exceeds the maxInteger limit?
   * See EqualityExplorerQueryParameters.maxInteger and https://github.com/phetsims/equality-explorer/issues/48
   */
  public maxIntegerExceeded(): boolean {
    return ( Math.abs( this.significantValue.numerator ) > EqualityExplorerQueryParameters.maxInteger ||
             Math.abs( this.significantValue.denominator ) > EqualityExplorerQueryParameters.maxInteger );
  }

  /**
   * Creates a snapshot of this term.
   * A snapshot consists of options that can be passed to the Term's constructor to re-create the Term.
   * Subtypes that have additional options should override this method and add to the options returned here.
   */
  public createSnapshot(): TermOptions {
    //TODO https://github.com/phetsims/equality-explorer/issues/186 why is this not the same as copyOptions? why no EqualityExplorerMovableOptions?
    return {
      diameter: this.diameter
    };
  }

  /**
   * Gets the Variable associated with this term. Term subclasses that do not have an associated variable
   * should return null. This method makes it more convenient to use the same drag listeners for all term types.
   */
  public abstract getVariable(): Variable | null;

  /**
   * Creates a copy of this term, with modifications through options.
   */
  public abstract copy( providedOptions: TermOptions ): Term;

  /**
   * Gets the weight of this term.
   */
  public abstract get weight(): Fraction;

  /**
   * Are this term and the specified term 'like terms'?
   * If you're not familiar with 'like terms', see https://en.wikipedia.org/wiki/Like_terms.
   */
  public abstract isLikeTerm( term: Term ): boolean;

  /**
   * Applies an operation to this term, resulting in a new term.
   * Returns null if the operation is not applicable to this term.
   */
  public abstract applyOperation( operation: UniversalOperation, providedOptions: TermOptions ): Term | null;

  /**
   * Adds a term to this term to create a new term.
   */
  public abstract plus( term: Term ): Term;

  /**
   * Subtracts a term from this term to create a new term.
   */
  public abstract minus( term: Term ): Term;

  /**
   * Multiplies this term by another term to create a new term.
   */
  public abstract times( term: Term ): Term;

  /**
   * Divides this term by another term to create a new term.
   */
  public abstract divided( term: Term ): Term;
}

equalityExplorer.register( 'Term', Term );