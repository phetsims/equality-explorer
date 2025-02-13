// Copyright 2017-2025, University of Colorado Boulder

/**
 * ObjectTermCreator creates and manages terms that are associated with real-world objects.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import equalityExplorer from '../../equalityExplorer.js';
import ObjectTermNode from '../view/ObjectTermNode.js'; // eslint-disable-line phet/no-view-imported-from-model
import ObjectTerm from './ObjectTerm.js';
import ObjectVariable from './ObjectVariable.js';
import Term from './Term.js';
import TermCreator, { TermCreatorOptions, TermCreatorSign } from './TermCreator.js';

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
    //TODO https://github.com/phetsims/equality-explorer/issues/200 PhET-iO dynamic element
    return new ObjectTerm( this.objectVariable, providedOptions );
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
    //TODO https://github.com/phetsims/equality-explorer/issues/200 PhET-iO dynamic element
    return new ObjectTermNode( this, term );
  }
}

equalityExplorer.register( 'ObjectTermCreator', ObjectTermCreator );