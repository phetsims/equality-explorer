// Copyright 2017-2022, University of Colorado Boulder

/**
 * ObjectTermCreator creates and manages terms that are associated with real-world objects.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TermCreator from '../../common/model/TermCreator.js';
import equalityExplorer from '../../equalityExplorer.js';
import ObjectTermNode from '../view/ObjectTermNode.js';
import ObjectTerm from './ObjectTerm.js';

export default class ObjectTermCreator extends TermCreator {

  /**
   * @param {ObjectVariable} variable
   * @param {Object} [options]
   */
  constructor( variable, options ) {

    phet.log && phet.log( `ObjectTermCreator: ${variable.symbolProperty.value}, weight=${variable.valueProperty.value}` );

    super( options );

    // @public (read-only)
    this.variable = variable;

    // When the variable's value changes, recompute the weight of terms on the scale. unlink not needed.
    this.variable.valueProperty.link( value => this.updateWeightOnPlateProperty() );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  //-------------------------------------------------------------------------------------------------
  // Below here is the implementation of the TermCreator API
  //-------------------------------------------------------------------------------------------------

  /**
   * Creates the icon used to represent this term in the TermsToolbox and equations.
   * @param {Object} [options]
   * @returns {scenery.Node}
   * @public
   * @override
   */
  createIcon( options ) {
    return ObjectTermNode.createInteractiveTermNode( this.variable.image, options );
  }

  /**
   * Instantiates a ObjectTerm.
   * @param {Object} [options]
   * @returns {Term}
   * @protected
   * @override
   */
  createTermProtected( options ) {
    return new ObjectTerm( this.variable, options );
  }

  /**
   * Creates a term whose significant value is zero. This is used when applying an operation to an empty plate.
   * The term is not managed by the TermCreator.
   * @param {Object} [options] - Term constructor options
   * @returns {Term}
   * @public
   * @abstract
   */
  createZeroTerm( options ) {
    throw new Error( 'createZeroTerm is not supported for ObjectTermCreator' );
  }

  /**
   * Instantiates the Node that corresponds to this term.
   * @param {Term} term
   * @returns {TermNode}
   * @public
   * @override
   */
  createTermNode( term ) {
    return new ObjectTermNode( this, term );
  }
}

equalityExplorer.register( 'ObjectTermCreator', ObjectTermCreator );