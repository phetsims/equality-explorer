// Copyright 2018-2019, University of Colorado Boulder

/**
 * Term whose value is a constant.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var Fraction = require( 'PHETCOMMON/model/Fraction' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var Term = require( 'EQUALITY_EXPLORER/common/model/Term' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function ConstantTerm( options ) {

    options = _.extend( {
      constantValue: EqualityExplorerConstants.DEFAULT_CONSTANT_VALUE
    }, options );

    assert && assert( options.constantValue instanceof Fraction, 'invalid constantValue: ' + options.constantValue );
    assert && assert( options.constantValue.isReduced(), 'constantValue must be reduced: ' + options.constantValue );
    assert && assert( !options.coefficient, 'coefficient is a VariableTerm option' );

    // @public (read-only) {Fraction}
    this.constantValue = options.constantValue;

    Term.call( this, this.constantValue, options );
  }

  equalityExplorer.register( 'ConstantTerm', ConstantTerm );

  return inherit( Term, ConstantTerm, {

    /**
     * For debugging only. Do not rely on the format of toString.
     * @returns {string}
     * @public
     */
    toString: function() {
      return 'ConstantTerm: ' + this.constantValue;
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
        constantValue: this.constantValue
      } );
    },

    /**
     * Adds a term to this term to create a new term.
     * @param {ConstantTerm} term
     * @param {Object} [options] - same as constructor
     * @returns {ConstantTerm}
     * @public
     */
    plus: function( term, options ) {
      options = options || {};
      assert && assert( !options.constantValue, 'ConstantTerm sets constantValue' );
      return this.copy( _.extend( {
        constantValue: this.constantValue.plus( term.constantValue ).reduce()
      }, options ) );
    },

    /**
     * Subtracts a term from this term to create a new term.
     * @param {ConstantTerm} term
     * @param {Object} [options] - same as constructor
     * @returns {ConstantTerm}
     */
    minus: function( term, options ) {
      options = options || {};
      assert && assert( !options.constantValue, 'ConstantTerm sets constantValue' );
      return this.copy( _.extend( {
        constantValue: this.constantValue.minus( term.constantValue ).reduce()
      }, options ) );
    },

    /**
     * Multiplies this term by another term to create a new term.
     * @param {ConstantTerm} term
     * @param {Object} [options] - same as constructor
     * @returns {ConstantTerm}
     */
    times: function( term, options ) {
      options = options || {};
      assert && assert( !options.constantValue, 'ConstantTerm sets constantValue' );
      return this.copy( _.extend( {
        constantValue: this.constantValue.times( term.constantValue ).reduce()
      }, options ) );
    },

    /**
     * Divides this term by another term to create a new term.
     * @param {ConstantTerm} term
     * @param {Object} [options] - same as constructor
     * @returns {ConstantTerm}
     */
    divided: function( term, options ) {
      options = options || {};
      assert && assert( !options.constantValue, 'ConstantTerm sets constantValue' );
      assert && assert( term.constantValue.getValue() !== 0, 'attempt to divide by zero' );
      return this.copy( _.extend( {
        constantValue: this.constantValue.divided( term.constantValue ).reduce()
      }, options ) );
    },

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
    copy: function( options ) {
      return new ConstantTerm( _.extend( this.copyOptions(), options ) );
    },

    /**
     * The weight of a constant term is the same as its value.
     * @returns {Fraction}
     * @public
     * @override
     */
    get weight() {
      return this.constantValue;
    },

    /**
     * Are this term and the specified term 'like terms'?
     * All constant terms are like terms.
     * @param {Term} term
     * @returns {boolean}
     * @public
     * @override
     */
    isLikeTerm: function( term ) {
      return ( term instanceof ConstantTerm );
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
        constantValue: this.constantValue
      } );
    },

    /**
     * Applies an operation to this term, resulting in a new term.
     * @param {UniversalOperation} operation
     * @param {Object} [options] - same as constructor
     * @returns {ConstantTerm|null} - null if the operation is not applicable to this term.
     * @public
     * @override
     */
    applyOperation: function( operation, options ) {

      var term = null;

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
  } );
} );
 