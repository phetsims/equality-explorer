// Copyright 2018-2022, University of Colorado Boulder

/**
 * ConstantTermCreator creates and manages constant terms.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Node } from '../../../../scenery/js/imports.js';
import { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerConstants from '../EqualityExplorerConstants.js';
import ConstantTermNode from '../view/ConstantTermNode.js';
import ConstantTerm from './ConstantTerm.js';
import TermCreator, { CreateTermOptions, TermCreatorOptions, TermCreatorSign } from './TermCreator.js';

type SelfOptions = EmptySelfOptions;

type ConstantTermCreatorOptions = SelfOptions & TermCreatorOptions;

export default class ConstantTermCreator extends TermCreator {

  public constructor( providedOptions?: ConstantTermCreatorOptions ) {
    super( providedOptions );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
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

  //-------------------------------------------------------------------------------------------------
  // Below here is the implementation of the TermCreator API
  //-------------------------------------------------------------------------------------------------

  /**
   * Creates the icon used to represent this term in the TermsToolbox and equations.
   * @param sign of the constant shown on the icon
   */
  public override createIcon( sign: TermCreatorSign = 1 ): Node {
    const constantValue = EqualityExplorerConstants.DEFAULT_CONSTANT_VALUE.timesInteger( sign );
    return ConstantTermNode.createInteractiveTermNode( constantValue );
  }

  /**
   * Instantiates a ConstantTerm.
   */
  protected override createTermProtected( providedOptions?: CreateTermOptions ): ConstantTerm {

    const options = combineOptions<CreateTermOptions>( {
      sign: 1
    }, providedOptions );

    // If the constant value wasn't specified, use the default.
    // @ts-ignore TODO https://github.com/phetsims/equality-explorer/issues/186 CreateTermOptions.constantValue
    options.constantValue = options.constantValue || EqualityExplorerConstants.DEFAULT_CONSTANT_VALUE;

    // Adjust the sign
    // @ts-ignore TODO https://github.com/phetsims/equality-explorer/issues/186 CreateTermOptions.constantValue
    options.constantValue = options.constantValue.timesInteger( options.sign );

    return new ConstantTerm( options );
  }

  /**
   * Creates a term whose significant value is zero. The term is not managed by the TermCreator.
   * This is used when applying an operation to an empty plate.
   */
  public override createZeroTerm( providedOptions?: CreateTermOptions ): ConstantTerm {
    const options = providedOptions || {};
    // @ts-ignore TODO https://github.com/phetsims/equality-explorer/issues/186 CreateTermOptions.constantValue
    assert && assert( !options.constantValue, 'ConstantTermCreator sets constantValue' );
    // @ts-ignore TODO https://github.com/phetsims/equality-explorer/issues/186 CreateTermOptions.constantValue
    options.constantValue = Fraction.fromInteger( 0 );
    return this.createTermProtected( options );
  }

  /**
   * Instantiates the Node that corresponds to this term.
   */
  public override createTermNode( term: ConstantTerm ): ConstantTermNode {
    return new ConstantTermNode( this, term );
  }
}

equalityExplorer.register( 'ConstantTermCreator', ConstantTermCreator );