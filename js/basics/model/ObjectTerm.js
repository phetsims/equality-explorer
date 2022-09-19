// Copyright 2017-2021, University of Colorado Boulder

/**
 * ObjectTerm is a term associated with a type of real-world object (sphere, apple, coin, dog, ...)
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import Term from '../../common/model/Term.js';
import equalityExplorer from '../../equalityExplorer.js';

// constants
const COEFFICIENT = Fraction.fromInteger( 1 ); // all object terms have an implicit coefficient of 1

export default class ObjectTerm extends Term {

  /**
   * @param {ObjectVariable} variable
   * @param {Object} [options]
   */
  constructor( variable, options ) {

    options = options || {};
    assert && assert( !options.constantValue, 'constantValue is a ConstantTerm option' );
    assert && assert( !options.coefficient, 'coefficient is a VariableTerm option' );

    super( COEFFICIENT, options );

    // @public (read-only)
    this.variable = variable;
  }

  /**
   * For debugging only. Do not rely on the format of toString.
   * @returns {string}
   * @public
   */
  toString() {
    return `ObjectTerm: ${this.variable.symbol} ${this.variable.valueProperty.value}`;
  }

  //-------------------------------------------------------------------------------------------------
  // Below here is the implementation of the Term API
  //-------------------------------------------------------------------------------------------------

  /**
   * Creates a copy of this term, with modifications through options.
   * @param {Object} [options] - same as constructor options
   * @returns {ObjectTerm}
   * @public
   * @override
   */
  copy( options ) {
    return new ObjectTerm( this.variable, merge( this.copyOptions(), options ) );
  }

  /**
   * Gets the weight of this term.
   * @returns {Fraction}
   * @public
   * @override
   */
  get weight() {
    return Fraction.fromInteger( this.variable.valueProperty.value );
  }

  /**
   * Are this term and the specified term 'like terms'?
   * ObjectTerms are 'like' if they are associated with the same variable.
   * @param {Term} term
   * @returns {boolean}
   * @public
   * @override
   */
  isLikeTerm( term ) {
    return ( term instanceof ObjectTerm ) && ( term.variable === this.variable );
  }

  /**
   * Applies an operation to this term, resulting in a new term.
   * @param {UniversalOperation} operation
   * @param {Object} [options] - same as constructor
   * @returns {ObjectTerm|null} - null if the operation is not applicable to this term.
   * @public
   * @override
   */
  applyOperation( operation, options ) {
    return null; // operations are not applicable to these terms
  }
}

equalityExplorer.register( 'ObjectTerm', ObjectTerm );