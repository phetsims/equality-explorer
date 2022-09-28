// Copyright 2017-2022, University of Colorado Boulder

/**
 * ObjectTermCreator creates and manages terms that are associated with real-world objects.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import TermCreator, { TermCreatorOptions, TermCreatorSign } from '../../common/model/TermCreator.js';
import equalityExplorer from '../../equalityExplorer.js';
import ObjectTermNode from '../view/ObjectTermNode.js';
import ObjectTerm, { ObjectTermOptions } from './ObjectTerm.js';
import ObjectVariable from './ObjectVariable.js';
import { Node } from '../../../../scenery/js/imports.js';

type SelfOptions = EmptySelfOptions;

type ObjectTermCreatorOptions = SelfOptions & StrictOmit<TermCreatorOptions, 'variable'>;

export default class ObjectTermCreator extends TermCreator {

  private readonly objectVariable: ObjectVariable;

  public constructor( variable: ObjectVariable, providedOptions?: ObjectTermCreatorOptions ) {

    phet.log && phet.log( `ObjectTermCreator: ${variable.symbolProperty.value}, weight=${variable.valueProperty.value}` );

    const options = optionize<ObjectTermCreatorOptions, SelfOptions, TermCreatorOptions>()( {
      variable: variable
    }, providedOptions );

    super( options );

    this.objectVariable = variable;

    // When the variable's value changes, recompute the weight of terms on the scale.
    this.objectVariable.valueProperty.link( () => this.updateWeightOnPlateProperty() );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  //-------------------------------------------------------------------------------------------------
  // Below here is the implementation of the TermCreator API
  //-------------------------------------------------------------------------------------------------

  /**
   * Creates the icon used to represent this term in the TermsToolbox and equations.
   */
  public override createIcon( sign?: TermCreatorSign ): Node {
    assert && assert( sign === 1, 'negative ObjectTerms are not supported' );
    return ObjectTermNode.createInteractiveTermNode( this.objectVariable.image );
  }

  /**
   * Instantiates an ObjectTerm.
   */
  protected override createTermProtected( providedOptions?: ObjectTermOptions ): ObjectTerm {
    return new ObjectTerm( this.objectVariable, providedOptions );
  }

  /**
   * Creates a term whose significant value is zero. This is used when applying an operation to an empty plate.
   * The term is not managed by the TermCreator.
   */
  public override createZeroTerm( providedOptions?: ObjectTermOptions ): ObjectTerm {
    assert && assert( false, 'createZeroTerm is unused and untested for ObjectTermCreator' );
    return this.createTermProtected( providedOptions );
  }

  /**
   * Instantiates the Node that corresponds to this term.
   */
  public override createTermNode( term: ObjectTerm ): ObjectTermNode {
    return new ObjectTermNode( this, term );
  }
}

equalityExplorer.register( 'ObjectTermCreator', ObjectTermCreator );