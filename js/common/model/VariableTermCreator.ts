// Copyright 2017-2022, University of Colorado Boulder

/**
 * VariableTermCreator creates and manages variable terms (e.g. 'x').
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import { Node, TColor } from '../../../../scenery/js/imports.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerColors from '../EqualityExplorerColors.js';
import EqualityExplorerConstants from '../EqualityExplorerConstants.js';
import VariableTermNode from '../view/VariableTermNode.js'; // eslint-disable-line no-view-imported-from-model
import TermCreator, { CreateTermOptions, TermCreatorOptions, TermCreatorSign } from './TermCreator.js';
import Variable from './Variable.js';
import VariableTerm, { VariableTermOptions } from './VariableTerm.js';
import Term from './Term.js';

type SelfOptions = {
  positiveFill?: TColor; // fill for the background of positive terms
  negativeFill?: TColor;  // fill for the background of negative terms
};

type VariableTermCreatorOptions = SelfOptions & StrictOmit<TermCreatorOptions, 'variable'>;

// options to createTermProtected and createZeroTerm
type CreateVariableTermOptions = CreateTermOptions & VariableTermOptions;

export default class VariableTermCreator extends TermCreator {

  private readonly positiveFill: TColor;
  private readonly negativeFill: TColor;

  public constructor( variable: Variable, providedOptions: VariableTermCreatorOptions ) {

    const options = optionize<VariableTermCreatorOptions, SelfOptions, TermCreatorOptions>()( {

      // SelfOptions
      positiveFill: EqualityExplorerColors.POSITIVE_X_FILL, // fill for the background of positive terms
      negativeFill: EqualityExplorerColors.NEGATIVE_X_FILL,  // fill for the background of negative terms

      // TermCreatorOptions
      variable: variable
    }, providedOptions );

    super( options );

    this.positiveFill = options.positiveFill;
    this.negativeFill = options.negativeFill;
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public override toString(): string {
    const variable = this.variable!;
    assert && assert( variable );
    return `VariableTermCreator variable={${variable}}`;
  }

  /**
   * Returns the sum of coefficients for all terms on the plate.
   */
  public sumCoefficientsOnPlate(): Fraction {
    let sum = Fraction.fromInteger( 0 );
    for ( let i = 0; i < this.termsOnPlate.length; i++ ) {
      const term = this.termsOnPlate.get( i );
      assert && assert( term instanceof VariableTerm ); // eslint-disable-line no-simple-type-checking-assertions
      sum = sum.plus( ( term as VariableTerm ).coefficient ).reduced();
    }
    return sum;
  }

  /**
   * Overridden so that we can expand the type definition of providedOptions, so that it includes properties
   * that are specific to this class. Note that super.createTerm calls createTermProtected.
   */
  public override createTerm( providedOptions?: CreateVariableTermOptions ): Term {
    return super.createTerm( providedOptions );
  }

  //-------------------------------------------------------------------------------------------------
  // Below here is the implementation of the TermCreator API
  //-------------------------------------------------------------------------------------------------

  /**
   * Creates the icon used to represent this term in the TermsToolboxNode and equations.
   */
  public override createIcon( sign: TermCreatorSign = 1 ): Node {

    const coefficient = EqualityExplorerConstants.DEFAULT_COEFFICIENT.timesInteger( sign );
    const variable = this.variable!;
    assert && assert( variable );

    return VariableTermNode.createInteractiveTermNode( coefficient, variable.symbolProperty, {
      positiveFill: this.positiveFill,
      negativeFill: this.negativeFill
    } );
  }

  /**
   * Instantiates a VariableTerm.
   */
  protected createTermProtected( providedOptions?: CreateVariableTermOptions ): VariableTerm {

    const options = combineOptions<CreateVariableTermOptions>( {
      sign: 1,
      coefficient: EqualityExplorerConstants.DEFAULT_COEFFICIENT
    }, providedOptions );

    // Adjust the sign
    assert && assert( options.sign !== undefined );
    assert && assert( options.coefficient !== undefined );
    options.coefficient = options.coefficient!.timesInteger( options.sign! );

    const variable = this.variable!;
    assert && assert( variable );

    return new VariableTerm( variable, options ); //TODO https://github.com/phetsims/equality-explorer/issues/200 dynamic
  }

  /**
   * Creates a term whose significant value is zero. This is used when applying an operation to an empty plate.
   * The term is not managed by the TermCreator, so we call createTermProtected instead of createTerm.
   */
  public override createZeroTerm( providedOptions?: CreateVariableTermOptions ): VariableTerm {
    const options = providedOptions || {};
    assert && assert( !options.coefficient, 'VariableTermCreator sets coefficient' );
    options.coefficient = Fraction.fromInteger( 0 );
    return this.createTermProtected( options );
  }

  /**
   * Instantiates the Node that corresponds to this term.
   */
  public override createTermNode( term: VariableTerm ): VariableTermNode {
    return new VariableTermNode( this, term, { //TODO https://github.com/phetsims/equality-explorer/issues/200 dynamic
      interactiveTermNodeOptions: {
        positiveFill: this.positiveFill,
        negativeFill: this.negativeFill
      }
    } );
  }
}

equalityExplorer.register( 'VariableTermCreator', VariableTermCreator );