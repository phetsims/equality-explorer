// Copyright 2018-2020, University of Colorado Boulder

/**
 * Term whose value is a coefficient times some variable value.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerConstants from '../EqualityExplorerConstants.js';
import ConstantTerm from './ConstantTerm.js';
import Term from './Term.js';

class VariableTerm extends Term {

  /**
   * @param {Variable} variable - the variable for this term, e.g. 'x'
   * @param {Object} [options]
   */
  constructor( variable, options ) {

    options = merge( {
      coefficient: EqualityExplorerConstants.DEFAULT_COEFFICIENT
    }, options );

    assert && assert( options.coefficient instanceof Fraction, 'invalid coefficient: ' + options.coefficient );
    assert && assert( options.coefficient.isReduced(), 'coefficient must be reduced: ' + options.coefficient );
    assert && assert( !options.constantValue, 'constantValue is a ConstantTerm option' );

    super( options.coefficient, options );

    // @public (read-only) {Fraction}
    this.coefficient = options.coefficient;

    // @public (read-only)
    this.variable = variable;
  }

  /**
   * For debugging only. Do not rely on the format of toString.
   * @returns {string}
   * @public
   */
  toString() {
    return 'VariableTerm: ' + this.coefficient + ' ' + this.variable;
  }

  /**
   * Creates the options that would be needed to instantiate a copy of this object.
   * @returns {Object}
   * @protected
   * @override
   */
  copyOptions() {
    return merge( {}, super.copyOptions(), {
      coefficient: this.coefficient
    } );
  }

  /**
   * Adds a variable term to this term to create a new term.
   * @param {VariableTerm} term
   * @param {Object} [options] - same as constructor
   * @returns {VariableTerm}
   */
  plus( term, options ) {
    assert && assert( this.isLikeTerm( term ), 'not a like term: ' + term );
    return this.copy( merge( {
      coefficient: this.coefficient.plus( term.coefficient ).reduced()
    }, options ) );
  }

  /**
   * Subtracts a variable term from this term to create a new term.
   * @param {VariableTerm} term
   * @param {Object} [options] - same as constructor
   * @returns {VariableTerm}
   */
  minus( term, options ) {
    assert && assert( this.isLikeTerm( term ), 'not a like term: ' + term );
    return this.copy( merge( {
      coefficient: this.coefficient.minus( term.coefficient ).reduced()
    }, options ) );
  }

  /**
   * Multiplies this term by a constant term to create a new term.
   * @param {ConstantTerm} term
   * @param {Object} [options] - same as constructor
   * @returns {VariableTerm}
   */
  times( term, options ) {
    assert && assert( term instanceof ConstantTerm, 'invalid term: ' + term );
    return this.copy( merge( {
      coefficient: this.coefficient.times( term.constantValue ).reduced()
    }, options ) );
  }

  /**
   * Divides this term by a constant term to create a new term.
   * @param {ConstantTerm} term
   * @param {Object} [options] - same as constructor
   * @returns {VariableTerm}
   */
  divided( term, options ) {
    assert && assert( term instanceof ConstantTerm, 'invalid term: ' + term );
    assert && assert( term.constantValue.getValue() !== 0, 'attempt to divide by zero' );
    return this.copy( merge( {
      coefficient: this.coefficient.divided( term.constantValue ).reduced()
    }, options ) );
  }

  //-------------------------------------------------------------------------------------------------
  // Below here is the implementation of the Term API
  //-------------------------------------------------------------------------------------------------

  /**
   * Creates a copy of this term, with modifications through options.
   * @param {Object} [options] - same as constructor options
   * @returns {VariableTerm}
   * @public
   * @override
   */
  copy( options ) {
    return new VariableTerm( this.variable, merge( this.copyOptions(), options ) );
  }

  /**
   * Gets the weight of this term.
   * @returns {Fraction}
   * @public
   * @override
   */
  get weight() {
    return this.coefficient.timesInteger( this.variable.valueProperty.value ).reduced();
  }

  /**
   * Are this term and the specified term 'like terms'?
   * Variable terms are 'like' if they are associated with the same variable.
   * @param {Term} term
   * @returns {boolean}
   * @public
   * @override
   */
  isLikeTerm( term ) {
    return ( term instanceof VariableTerm ) && ( term.variable === this.variable );
  }

  /**
   * Creates a snapshot of this term.
   * A snapshot consists of options that can be passed to the Term's constructor to re-create the Term.
   * @returns {Object}
   * @public
   * @override
   */
  createSnapshot() {
    const supertypeOptions = super.createSnapshot();
    return merge( {}, supertypeOptions, {
      coefficient: this.coefficient
    } );
  }

  /**
   * Applies an operation to this term, resulting in a new term.
   * @param {UniversalOperation} operation
   * @param {Object} [options] - same as constructor
   * @returns {VariableTerm|null} - null if the operation is not applicable to this term.
   * @public
   * @override
   */
  applyOperation( operation, options ) {

    let term = null;

    if ( operation.operand instanceof VariableTerm ) {

      // plus or minus a constant
      if ( operation.operator === MathSymbols.PLUS ) {
        term = this.plus( operation.operand, options );
      }
      else if ( operation.operator === MathSymbols.MINUS ) {
        term = this.minus( operation.operand, options );
      }
    }
    else if ( operation.operand instanceof ConstantTerm ) {

      // times or divide by a variable
      if ( operation.operator === MathSymbols.TIMES ) {
        term = this.times( operation.operand, options );
      }
      else if ( operation.operator === MathSymbols.DIVIDE ) {
        term = this.divided( operation.operand, options );
      }
    }

    return term;
  }
}

equalityExplorer.register( 'VariableTerm', VariableTerm );

export default VariableTerm;