// Copyright 2018-2022, University of Colorado Boulder

/**
 * ConstantTermCreator creates and manages constant terms.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Node } from '../../../../scenery/js/imports.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerConstants from '../EqualityExplorerConstants.js';
import ConstantTermNode from '../view/ConstantTermNode.js';
import ConstantTerm, { ConstantTermOptions } from './ConstantTerm.js';
import TermCreator, { CreateTermOptions, TermCreatorOptions, TermCreatorSign } from './TermCreator.js';
import Term from './Term.js';

type SelfOptions = {
  constantValue?: Fraction; // the default constant value used to create terms
};

type ConstantTermCreatorOptions = SelfOptions & TermCreatorOptions;

// options to createTermProtected and createZeroTerm
type CreateConstantTermOptions = CreateTermOptions & ConstantTermOptions;

export default class ConstantTermCreator extends TermCreator {

  private readonly constantValue: Fraction;

  public constructor( providedOptions: ConstantTermCreatorOptions ) {

    const options = optionize<ConstantTermCreatorOptions, SelfOptions, TermCreatorOptions>()( {

      // SelfOptions
      constantValue: EqualityExplorerConstants.DEFAULT_CONSTANT_VALUE
    }, providedOptions );

    super( options );

    this.constantValue = options.constantValue;
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public override toString(): string {
    return `ConstantTermCreator constantValue=${this.constantValue}`;
  }

  /**
   * Returns the sum of constant values for all terms on the plate.
   */
  public sumConstantsOnPlate(): Fraction {
    let sum = Fraction.fromInteger( 0 );
    for ( let i = 0; i < this.termsOnPlate.length; i++ ) {
      const term = this.termsOnPlate.get( i );
      assert && assert( term instanceof ConstantTerm ); // eslint-disable-line no-simple-type-checking-assertions
      sum = sum.plus( ( term as ConstantTerm ).constantValue ).reduced();
    }
    return sum;
  }

  /**
   * Overridden so that we can expand the type definition of providedOptions, so that it includes properties
   * that are specific to this class. Note that super.createTerm calls createTermProtected.
   */
  public override createTerm( providedOptions?: CreateConstantTermOptions ): Term {
    return super.createTerm( providedOptions );
  }

  //-------------------------------------------------------------------------------------------------
  // Below here is the implementation of the TermCreator API
  //-------------------------------------------------------------------------------------------------

  /**
   * Creates the icon used to represent this term in the TermsToolboxNode and equations.
   * @param sign of the constant shown on the icon
   */
  public override createIcon( sign: TermCreatorSign = 1 ): Node {
    const constantValue = this.constantValue.timesInteger( sign );
    return ConstantTermNode.createInteractiveTermNode( constantValue );
  }

  /**
   * Instantiates a ConstantTerm.
   */
  protected override createTermProtected( providedOptions?: CreateConstantTermOptions ): ConstantTerm {

    const options = combineOptions<CreateConstantTermOptions>( {
      sign: 1,
      constantValue: this.constantValue
    }, providedOptions );

    // Adjust the sign
    assert && assert( options.sign !== undefined );
    assert && assert( options.constantValue !== undefined );
    options.constantValue = options.constantValue!.timesInteger( options.sign! );

    return new ConstantTerm( options ); //TODO dynamic
  }

  /**
   * Creates a term whose significant value is zero. This is used when applying an operation to an empty plate.
   * The term is not managed by the TermCreator, so we call createTermProtected instead of createTerm.
   */
  public override createZeroTerm( providedOptions?: CreateConstantTermOptions ): ConstantTerm {
    const options = providedOptions || {};
    assert && assert( !options.constantValue, 'ConstantTermCreator sets constantValue' );
    options.constantValue = Fraction.fromInteger( 0 );
    return this.createTermProtected( options );
  }

  /**
   * Instantiates the Node that corresponds to this term.
   */
  public override createTermNode( term: ConstantTerm ): ConstantTermNode {
    return new ConstantTermNode( this, term ); //TODO dynamic
  }
}

equalityExplorer.register( 'ConstantTermCreator', ConstantTermCreator );