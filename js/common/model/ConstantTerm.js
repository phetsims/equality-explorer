// Copyright 2018-2020, University of Colorado Boulder

/**
 * Term whose value is a constant.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerConstants from '../EqualityExplorerConstants.js';
import Term from './Term.js';

class ConstantTerm extends Term {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      constantValue: EqualityExplorerConstants.DEFAULT_CONSTANT_VALUE
    }, options );

    assert && assert( options.constantValue instanceof Fraction, 'invalid constantValue: ' + options.constantValue );
    assert && assert( options.constantValue.isReduced(), 'constantValue must be reduced: ' + options.constantValue );
    assert && assert( !options.coefficient, 'coefficient is a VariableTerm option' );

    super( options.constantValue, options );

    // @public (read-only) {Fraction}
    this.constantValue = options.constantValue;
  }

  /**
   * For debugging only. Do not rely on the format of toString.
   * @returns {string}
   * @public
   */
  toString() {
    return 'ConstantTerm: ' + this.constantValue;
  }

  /**
   * Creates the options that would be needed to instantiate a copy of this object.
   * @returns {Object}
   * @protected
   * @override
   */
  copyOptions() {
    const supertypeOptions = Term.prototype.copyOptions.call( this );
    return merge( {}, supertypeOptions, {
      constantValue: this.constantValue
    } );
  }

  /**
   * Adds a term to this term to create a new term.
   * @param {ConstantTerm} term
   * @param {Object} [options] - same as constructor
   * @returns {ConstantTerm}
   * @public
   */
  plus( term, options ) {
    options = options || {};
    assert && assert( !options.constantValue, 'ConstantTerm sets constantValue' );
    return this.copy( merge( {
      constantValue: this.constantValue.plus( term.constantValue ).reduce()
    }, options ) );
  }

  /**
   * Subtracts a term from this term to create a new term.
   * @param {ConstantTerm} term
   * @param {Object} [options] - same as constructor
   * @returns {ConstantTerm}
   */
  minus( term, options ) {
    options = options || {};
    assert && assert( !options.constantValue, 'ConstantTerm sets constantValue' );
    return this.copy( merge( {
      constantValue: this.constantValue.minus( term.constantValue ).reduce()
    }, options ) );
  }

  /**
   * Multiplies this term by another term to create a new term.
   * @param {ConstantTerm} term
   * @param {Object} [options] - same as constructor
   * @returns {ConstantTerm}
   */
  times( term, options ) {
    options = options || {};
    assert && assert( !options.constantValue, 'ConstantTerm sets constantValue' );
    return this.copy( merge( {
      constantValue: this.constantValue.times( term.constantValue ).reduce()
    }, options ) );
  }

  /**
   * Divides this term by another term to create a new term.
   * @param {ConstantTerm} term
   * @param {Object} [options] - same as constructor
   * @returns {ConstantTerm}
   */
  divided( term, options ) {
    options = options || {};
    assert && assert( !options.constantValue, 'ConstantTerm sets constantValue' );
    assert && assert( term.constantValue.getValue() !== 0, 'attempt to divide by zero' );
    return this.copy( merge( {
      constantValue: this.constantValue.divided( term.constantValue ).reduce()
    }, options ) );
  }

  //-------------------------------------------------------------------------------------------------
  // Below here is the implementation of the Term API
  //-------------------------------------------------------------------------------------------------

  /**
   * Creates a copy of this term, with modifications through options.
   * @param {Object} [options] - same as constructor options
   * @returns {ConstantTerm}
   * @public
   * @override
   */
  copy( options ) {
    return new ConstantTerm( merge( this.copyOptions(), options ) );
  }

  /**
   * The weight of a constant term is the same as its value.
   * @returns {Fraction}
   * @public
   * @override
   */
  get weight() {
    return this.constantValue;
  }

  /**
   * Are this term and the specified term 'like terms'?
   * All constant terms are like terms.
   * @param {Term} term
   * @returns {boolean}
   * @public
   * @override
   */
  isLikeTerm( term ) {
    return ( term instanceof ConstantTerm );
  }

  /**
   * Creates a snapshot of this term.
   * A snapshot consists of options that can be passed to the Term's constructor to re-create the Term.
   * @returns {Object}
   * @public
   * @override
   */
  createSnapshot() {
    const supertypeOptions = Term.prototype.createSnapshot.call( this );
    return merge( {}, supertypeOptions, {
      constantValue: this.constantValue
    } );
  }

  /**
   * Applies an operation to this term, resulting in a new term.
   * @param {UniversalOperation} operation
   * @param {Object} [options] - same as constructor
   * @returns {ConstantTerm|null} - null if the operation is not applicable to this term.
   * @public
   * @override
   */
  applyOperation( operation, options ) {

    let term = null;

    // constant operands only
    if ( operation.operand instanceof ConstantTerm ) {

      if ( operation.operator === MathSymbols.PLUS ) {
        term = this.plus( operation.operand, options );
      }
      else if ( operation.operator === MathSymbols.MINUS ) {
        term = this.minus( operation.operand, options );
      }
      else if ( operation.operator === MathSymbols.TIMES ) {
        term = this.times( operation.operand, options );
      }
      else if ( operation.operator === MathSymbols.DIVIDE ) {
        term = this.divided( operation.operand, options );
      }
    }

    return term;
  }
}

equalityExplorer.register( 'ConstantTerm', ConstantTerm );

export default ConstantTerm;