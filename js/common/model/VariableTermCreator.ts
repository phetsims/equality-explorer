// Copyright 2017-2022, University of Colorado Boulder

/**
 * VariableTermCreator creates and manages variable terms (e.g. 'x').
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import optionize from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import { Node, NodeOptions, TColor } from '../../../../scenery/js/imports.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerColors from '../EqualityExplorerColors.js';
import EqualityExplorerConstants from '../EqualityExplorerConstants.js';
import VariableTermNode from '../view/VariableTermNode.js';
import TermCreator, { TermCreatorOptions } from './TermCreator.js';
import Variable from './Variable.js';
import VariableTerm, { VariableTermOptions } from './VariableTerm.js';

type SelfOptions = {
  positiveFill?: TColor; // fill for the background of positive terms
  negativeFill?: TColor;  // fill for the background of negative terms
};

type VariableTermCreatorOptions = SelfOptions & StrictOmit<TermCreatorOptions, 'variable'>;

export default class VariableTermCreator extends TermCreator {

  private readonly positiveFill: TColor;
  private readonly negativeFill: TColor;

  public constructor( variable: Variable, providedOptions?: VariableTermCreatorOptions ) {

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

    // When the variable's value changes, recompute the weight of terms on the scale.
    variable.valueProperty.link( variableValue => this.updateWeightOnPlateProperty() );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Returns the sum of coefficients for all terms on the plate.
   */
  public sumCoefficientsOnPlate(): Fraction {
    let sum = Fraction.fromInteger( 0 );
    for ( let i = 0; i < this.termsOnPlate.length; i++ ) {
      // @ts-ignore TODO https://github.com/phetsims/equality-explorer/issues/186
      sum = sum.plus( this.termsOnPlate.get( i ).coefficient ).reduced();
    }
    return sum;
  }

  //-------------------------------------------------------------------------------------------------
  // Below here is the implementation of the TermCreator API
  //-------------------------------------------------------------------------------------------------

  /**
   * Creates the icon used to represent this term in the TermsToolbox and equations.
   */
  public override createIcon( providedOptions?: NodeOptions ): Node {

    //TODO https://github.com/phetsims/equality-explorer/issues/186
    // eslint-disable-next-line bad-typescript-text
    const options = merge( {
      sign: 1  // sign of the coefficient shown on the icon, 1 or -1
    }, providedOptions );
    assert && assert( options.sign === 1 || options.sign === -1, `invalid sign: ${options.sign}` );

    const coefficient = EqualityExplorerConstants.DEFAULT_COEFFICIENT.timesInteger( options.sign );
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
  protected createTermProtected( providedOptions?: VariableTermOptions ): VariableTerm {

    //TODO https://github.com/phetsims/equality-explorer/issues/186
    // eslint-disable-next-line bad-typescript-text
    const options = merge( {
      sign: 1
    }, providedOptions );
    assert && assert( options.sign === 1 || options.sign === -1, `invalid sign: ${options.sign}` );

    // If the coefficient wasn't specified, use the default.
    options.coefficient = options.coefficient || EqualityExplorerConstants.DEFAULT_COEFFICIENT;

    // Adjust the sign
    options.coefficient = options.coefficient.timesInteger( options.sign );

    const variable = this.variable!;
    assert && assert( variable );

    return new VariableTerm( variable, options );
  }

  /**
   * Creates a term whose significant value is zero. This is used when applying an operation to an empty plate.
   * The term is not managed by the TermCreator.
   */
  public override createZeroTerm( providedOptions?: VariableTermOptions ): VariableTerm {
    const options = providedOptions || {};
    assert && assert( !options.coefficient, 'VariableTermCreator sets coefficient' );
    options.coefficient = Fraction.fromInteger( 0 );
    return this.createTermProtected( options );
  }

  /**
   * Instantiates the Node that corresponds to this term.
   */
  public override createTermNode( term: VariableTerm ): VariableTermNode {
    return new VariableTermNode( this, term, {
      interactiveTermNodeOptions: {
        positiveFill: this.positiveFill,
        negativeFill: this.negativeFill
      }
    } );
  }
}

equalityExplorer.register( 'VariableTermCreator', VariableTermCreator );