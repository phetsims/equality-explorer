// Copyright 2018-2019, University of Colorado Boulder

/**
 * Term whose value is a coefficient times some variable value.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ConstantTerm = require( 'EQUALITY_EXPLORER/common/model/ConstantTerm' );
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  const Fraction = require( 'PHETCOMMON/model/Fraction' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const Term = require( 'EQUALITY_EXPLORER/common/model/Term' );

  /**
   * @param {Variable} variable - the variable for this term, e.g. 'x'
   * @param {Object} [options]
   * @constructor
   */
  function VariableTerm( variable, options ) {

    options = _.extend( {
      coefficient: EqualityExplorerConstants.DEFAULT_COEFFICIENT
    }, options );

    assert && assert( options.coefficient instanceof Fraction, 'invalid coefficient: ' + options.coefficient );
    assert && assert( options.coefficient.isReduced(), 'coefficient must be reduced: ' + options.coefficient );
    assert && assert( !options.constantValue, 'constantValue is a ConstantTerm option' );

    // @public (read-only) {Fraction}
    this.coefficient = options.coefficient;

    // @public (read-only)
    this.variable = variable;

    Term.call( this, this.coefficient, options );
  }

  equalityExplorer.register( 'VariableTerm', VariableTerm );

  return inherit( Term, VariableTerm, {

    /**
     * For debugging only. Do not rely on the format of toString.
     * @returns {string}
     * @public
     */
    toString: function() {
      return 'VariableTerm: ' + this.coefficient + ' ' + this.variable;
    },

    /**
     * Creates the options that would be needed to instantiate a copy of this object.
     * @returns {Object}
     * @protected
     * @override
     */
    copyOptions: function() {
      var supertypeOptions = Term.prototype.copyOptions.call( this );
      return _.extend( {}, supertypeOptions, {
        coefficient: this.coefficient
      } );
    },

    /**
     * Adds a variable term to this term to create a new term.
     * @param {VariableTerm} term
     * @param {Object} [options] - same as constructor
     * @returns {VariableTerm}
     */
    plus: function( term, options ) {
      assert && assert( this.isLikeTerm( term ), 'not a like term: ' + term );
      return this.copy( _.extend( {
        coefficient: this.coefficient.plus( term.coefficient ).reduced()
      }, options ) );
    },

    /**
     * Subtracts a variable term from this term to create a new term.
     * @param {VariableTerm} term
     * @param {Object} [options] - same as constructor
     * @returns {VariableTerm}
     */
    minus: function( term, options ) {
      assert && assert( this.isLikeTerm( term ), 'not a like term: ' + term );
      return this.copy( _.extend( {
        coefficient: this.coefficient.minus( term.coefficient ).reduced()
      }, options ) );
    },

    /**
     * Multiplies this term by a constant term to create a new term.
     * @param {ConstantTerm} term
     * @param {Object} [options] - same as constructor
     * @returns {VariableTerm}
     */
    times: function( term, options ) {
      assert && assert( term instanceof ConstantTerm, 'invalid term: ' + term );
      return this.copy( _.extend( {
        coefficient: this.coefficient.times( term.constantValue ).reduced()
      }, options ) );
    },

    /**
     * Divides this term by a constant term to create a new term.
     * @param {ConstantTerm} term
     * @param {Object} [options] - same as constructor
     * @returns {VariableTerm}
     */
    divided: function( term, options ) {
      assert && assert( term instanceof ConstantTerm, 'invalid term: ' + term );
      assert && assert( term.constantValue.getValue() !== 0, 'attempt to divide by zero' );
      return this.copy( _.extend( {
        coefficient: this.coefficient.divided( term.constantValue ).reduced()
      }, options ) );
    },

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
    copy: function( options ) {
      return new VariableTerm( this.variable, _.extend( this.copyOptions(), options ) );
    },

    /**
     * Gets the weight of this term.
     * @returns {Fraction}
     * @public
     * @override
     */
    get weight() {
      return this.coefficient.timesInteger( this.variable.valueProperty.value ).reduced();
    },

    /**
     * Are this term and the specified term 'like terms'?
     * Variable terms are 'like' if they are associated with the same variable.
     * @param {Term} term
     * @returns {boolean}
     * @public
     * @override
     */
    isLikeTerm: function( term ) {
      return ( term instanceof VariableTerm ) && ( term.variable === this.variable );
    },

    /**
     * Creates a snapshot of this term.
     * A snapshot consists of options that can be passed to the Term's constructor to re-create the Term.
     * @returns {Object}
     * @public
     * @override
     */
    createSnapshot: function() {
      var supertypeOptions = Term.prototype.createSnapshot.call( this );
      return _.extend( {}, supertypeOptions, {
        coefficient: this.coefficient
      } );
    },

    /**
     * Applies an operation to this term, resulting in a new term.
     * @param {UniversalOperation} operation
     * @param {Object} [options] - same as constructor
     * @returns {VariableTerm|null} - null if the operation is not applicable to this term.
     * @public
     * @override
     */
    applyOperation: function( operation, options ) {

      var term = null;

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
  } );
} );
 