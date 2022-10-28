// Copyright 2017-2022, University of Colorado Boulder

/**
 * ObjectTermCreator creates and manages terms that are associated with real-world objects.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import TermCreator, { TermCreatorOptions, TermCreatorSign } from './TermCreator.js';
import equalityExplorer from '../../equalityExplorer.js';
import ObjectTermNode from '../view/ObjectTermNode.js';
import ObjectTerm from './ObjectTerm.js';
import ObjectVariable from './ObjectVariable.js';
import { Node } from '../../../../scenery/js/imports.js';
import Term from './Term.js';

type SelfOptions = EmptySelfOptions;

type ObjectTermCreatorOptions = SelfOptions & StrictOmit<TermCreatorOptions, 'variable'>;

export default class ObjectTermCreator extends TermCreator {

  private readonly objectVariable: ObjectVariable;

  public constructor( variable: ObjectVariable, providedOptions: ObjectTermCreatorOptions ) {

    const options = optionize<ObjectTermCreatorOptions, SelfOptions, TermCreatorOptions>()( {
      variable: variable
    }, providedOptions );

    super( options );

    this.objectVariable = variable;

    phet.log && phet.log( this );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public override toString(): string {
    return `ObjectTermCreator variable={${this.objectVariable}}`;
  }

  /**
   * Overridden so that we can expand the type definition of providedOptions, so that it includes properties
   * that are specific to this class. Note that super.createTerm calls createTermProtected.
   */
  public override createTerm( providedOptions?: ObjectTermCreatorOptions ): Term {
    return super.createTerm( providedOptions );
  }

  //-------------------------------------------------------------------------------------------------
  // Below here is the implementation of the TermCreator API
  //-------------------------------------------------------------------------------------------------

  /**
   * Creates the icon used to represent this term in the TermsToolboxNode and equations.
   */
  public override createIcon( sign: TermCreatorSign = 1 ): Node {
    assert && assert( sign === 1, 'negative ObjectTerms are not supported' );
    return ObjectTermNode.createInteractiveTermNode( this.objectVariable.image );
  }

  /**
   * Instantiates an ObjectTerm.
   */
  protected override createTermProtected( providedOptions?: ObjectTermCreatorOptions ): ObjectTerm {
    return new ObjectTerm( this.objectVariable, providedOptions ); //TODO https://github.com/phetsims/equality-explorer/issues/200 dynamic
  }

  /**
   * Creates a term whose significant value is zero. This is used when applying an operation to an empty plate.
   * The term is not managed by the TermCreator, so we call createTermProtected instead of createTerm.
   */
  public override createZeroTerm( providedOptions?: ObjectTermCreatorOptions ): ObjectTerm {
    assert && assert( false, 'createZeroTerm is unused and untested for ObjectTermCreator' );
    return this.createTermProtected( providedOptions );
  }

  /**
   * Instantiates the Node that corresponds to this term.
   */
  public override createTermNode( term: ObjectTerm ): ObjectTermNode {
    return new ObjectTermNode( this, term ); //TODO https://github.com/phetsims/equality-explorer/issues/200 dynamic
  }
}

equalityExplorer.register( 'ObjectTermCreator', ObjectTermCreator );