// Copyright 2018, University of Colorado Boulder

/**
 * ConstantTermCreator creates and manages constant terms.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ConstantTerm = require( 'EQUALITY_EXPLORER/common/model/ConstantTerm' );
  var ConstantTermNode = require( 'EQUALITY_EXPLORER/common/view/ConstantTermNode' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var Fraction = require( 'PHETCOMMON/model/Fraction' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var TermCreator = require( 'EQUALITY_EXPLORER/common/model/TermCreator' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function ConstantTermCreator( options ) {

    // @private terms are created with this value by default
    this.defaultConstantValue = Fraction.fromInteger( 1 );

    TermCreator.call( this, options );
  }

  equalityExplorer.register( 'ConstantTermCreator', ConstantTermCreator );

  return inherit( TermCreator, ConstantTermCreator, {

    /**
     * Returns the sum of constant values for all terms on the scale.
     * @returns {RationalNumber}
     * @public
     */
    sumConstantsOnScale: function() {
      var sum = Fraction.fromInteger( 0 );
      for ( var i = 0; i < this.termsOnPlate.length; i++ ) {
        sum = sum.plus( this.termsOnPlate.get( i ).constantValue ).reduced();
      }
      return sum;
    },

    //-------------------------------------------------------------------------------------------------
    // Below here is the implementation of the TermCreator API
    //-------------------------------------------------------------------------------------------------

    /**
     * Creates the icon used to represent this term in the TermsToolbox and equations.
     * @param {Object} [options]
     * @returns {Node}
     * @public
     * @override
     */
    createIcon: function( options ) {

      options = _.extend( {
        sign: 1  // sign of the constant shown on the icon, 1 or -1
      }, options );
      assert && assert( options.sign === 1 || options.sign === -1, 'invalid sign: ' + options.sign );

      return ConstantTermNode.createInteractiveTermNode( this.defaultConstantValue.timesInteger( options.sign ) );
    },

    /**
     * Does the specified term have a numerator or denominator that exceeds EqualityExplorerConstants.LARGEST_INTEGER?
     * @param {Term} term
     * @returns {boolean}
     * @public
     * @override
     */
    isNumberLimitExceeded: function( term ) {
      assert && assert( term instanceof ConstantTerm, 'invalid term: ' + term );
      return ( Math.abs( term.constantValue.numerator ) > EqualityExplorerConstants.LARGEST_INTEGER ||
               Math.abs( term.constantValue.denominator ) > EqualityExplorerConstants.LARGEST_INTEGER );
    },

    /**
     * Instantiates a ConstantTerm.
     * @param {Object} [options] - passed to the ConstantTerm's constructor
     * @returns {Term}
     * @protected
     * @override
     */
    createTermProtected: function( options ) {

      options = _.extend( {
        sign: 1
      }, options );
      assert && assert( options.sign === 1 || options.sign === -1, 'invalid sign: ' + options.sign );

      // If the constant value wasn't specified, use the default with sign applied.
      if ( !options.constantValue ) {
        options.constantValue = this.defaultConstantValue.timesInteger( options.sign );
      }

      // If the location wasn't specified, choose location based on sign of the constant.
      // This determines which TermCreatorNode in the TermToolbox this term will animate to.
      if( !options.location ) {
        if ( options.constantValue.sign === 1 ) {
          options.location = this.positiveLocation;
        }
        else {
          options.location = this.negativeLocation;
        }
      }

      return new ConstantTerm( options );
    },

    /**
     * Creates a new term by combining two terms.
     * @param {Term} term1
     * @param {Term} term2
     * @param {Object} options - passed to the combined ConstantTerm's constructor
     * @returns {Term|null} - the combined term, null if the terms sum to zero
     * @public
     * @override
     */
    combineTerms: function( term1, term2, options ) {

      assert && assert( term1 instanceof ConstantTerm, 'invalid term1: ' + term1 );
      assert && assert( term2 instanceof ConstantTerm, 'invalid term2: ' + term2 );

      options = options || {};

      assert && assert( !options.constantValue, 'ConstantTermCreator sets constantValue' );
      options.constantValue = term1.constantValue.plus( term2.constantValue ).reduced();

      // If the constant is not zero, create a new term.
      var combinedTerm = null;
      if ( options.constantValue.getValue() !== 0 ) {
        combinedTerm = this.createTerm( options );
      }
      return combinedTerm;
    },

    /**
     * Copies the specified term, with possible modifications specified via options.
     * @param {Term} term
     * @param {Object} [options] - passed to the new ConstantTerm's constructor
     * @returns {Term}
     * @public
     * @override
     */
    copyTerm: function( term, options ) {
      assert && assert( term instanceof ConstantTerm, 'invalid term: ' + term );

      options = options || {};
      assert && assert( !options.constantValue, 'ConstantTerm sets constantValue' );
      options.constantValue = term.constantValue;

      return this.createTerm( options );
    },

    /**
     * Instantiates the Node that corresponds to this term.
     * @param {Term} term
     * @param {Object} [options]  - passed to the ConstantTermNode's constructor
     * @returns {TermNode}
     * @public
     * @override
     */
    createTermNode: function( term, options ) {
      return new ConstantTermNode( this, term, this.plate, options );
    },

    /**
     * Applies an operation to terms on the plate.
     *
     * @param {UniversalOperation} operation
     * @returns {boolean} - true if the operation resulted in a term on the plate becoming zero, false otherwise
     */
    applyOperation: function( operation ) {
      
      assert && assert( this.combineLikeTermsEnabled, 'applyOperation is only supported when combining like terms' );
      assert && assert( this.termsOnPlate.length <= 1, 'expected at most 1 term on plate: ' + this.termsOnPlate.length );
      
      var summedToZero = false;

      // only constant operands apply to constant terms
      if ( operation.operand instanceof ConstantTerm ) {

        var newConstantValue = null; // {Fraction|null}

        var termOnPlate = this.plate.getTermInCell( this.likeTermsCell ); // {ConstantTerm}
        var constantValueOperand = operation.operand.constantValue; // {Fraction}

        if ( termOnPlate ) {

          // there is a term on the plate, apply the operation if it's relevant
          if ( operation.operator === MathSymbols.PLUS ) {
            newConstantValue = termOnPlate.constantValue.plus( constantValueOperand ).reduced();
          }
          else if ( operation.operator === MathSymbols.MINUS ) {
            newConstantValue = termOnPlate.constantValue.minus( constantValueOperand ).reduced();
          }
          else if ( operation.operator === MathSymbols.TIMES ) {
            newConstantValue = termOnPlate.constantValue.times( constantValueOperand ).reduced();
          }
          else if ( operation.operator === MathSymbols.DIVIDE ) {
            assert && assert( constantValueOperand.getValue() !== 0, 'attempt to divide by zero' );
            newConstantValue = termOnPlate.constantValue.divided( constantValueOperand ).reduced();
          }
        }
        else {

          // there is no term on the plate, create one if the operation is relevant
          if ( operation.operator === MathSymbols.PLUS ) {
            newConstantValue = constantValueOperand;
          }
          else if ( operation.operator === MathSymbols.MINUS ) {
            newConstantValue = constantValueOperand.timesInteger( -1 );
          }
        }

        if ( newConstantValue ) {

          // dispose of the term on the plate
          termOnPlate && termOnPlate.dispose();

          if ( newConstantValue.getValue() === 0 ) {
            summedToZero = true;
          }
          else {

            // create a new term on the plate
            this.createTermOnPlate( this.likeTermsCell, {
              constantValue: newConstantValue,
              diameter: EqualityExplorerConstants.BIG_TERM_DIAMETER
            } );
          }
        }
      }

      return summedToZero;
    }
  } );
} );
 