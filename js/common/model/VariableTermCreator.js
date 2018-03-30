// Copyright 2017-2018, University of Colorado Boulder

/**
 * VariableTermCreator creates and manages variable terms (e.g. 'x').
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ConstantTerm = require( 'EQUALITY_EXPLORER/common/model/ConstantTerm' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerColors = require( 'EQUALITY_EXPLORER/common/EqualityExplorerColors' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var Fraction = require( 'PHETCOMMON/model/Fraction' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var TermCreator = require( 'EQUALITY_EXPLORER/common/model/TermCreator' );
  var VariableTerm = require( 'EQUALITY_EXPLORER/common/model/VariableTerm' );
  var VariableTermNode = require( 'EQUALITY_EXPLORER/common/view/VariableTermNode' );

  /**
   * @param {Variable} variable
   * @param {Object} [options]
   * @constructor
   */
  function VariableTermCreator( variable, options ) {

    var self = this;

    options = _.extend( {
      positiveFill: EqualityExplorerColors.POSITIVE_X_FILL,
      negativeFill: EqualityExplorerColors.NEGATIVE_X_FILL
    }, options );

    // @public (read-only)
    this.variable = variable;

    // @private
    this.defaultCoefficient = Fraction.fromInteger( 1 ); // terms are created with this coefficient by default
    this.positiveFill = options.positiveFill;
    this.negativeFill = options.negativeFill;

    TermCreator.call( this, options );

    // When the variable values changes, recompute the weight of terms on the scale.
    // dispose not needed.
    this.variable.valueProperty.link( function( variableValue ) {
      self.updateWeightOnPlateProperty();
    } );
  }

  equalityExplorer.register( 'VariableTermCreator', VariableTermCreator );

  return inherit( TermCreator, VariableTermCreator, {

    /**
     * Returns the sum of coefficients for all terms on the scale.
     * @returns {RationalNumber}
     * @public
     */
    sumCoefficientsOnScale: function() {
      var sum = Fraction.fromInteger( 0 );
      for ( var i = 0; i < this.termsOnPlate.length; i++ ) {
        sum = sum.plus( this.termsOnPlate.get( i ).coefficient ).reduced();
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
        sign: 1  // sign of the coefficient shown on the icon, 1 or -1
      }, options );
      assert && assert( options.sign === 1 || options.sign === -1, 'invalid sign: ' + options.sign );

      return VariableTermNode.createInteractiveTermNode(
        this.defaultCoefficient.timesInteger( options.sign ), this.variable.symbol, {
          positiveFill: this.positiveFill,
          negativeFill: this.negativeFill
        } );
    },

    /**
     * Instantiates a VariableTerm.
     * @param {Object} [options] - passed to the VariableTerm's constructor
     * @returns {Term}
     * @protected
     * @override
     */
    createTermProtected: function( options ) {

      options = _.extend( {
        sign: 1
      }, options );
      assert && assert( options.sign === 1 || options.sign === -1, 'invalid sign: ' + options.sign );

      if ( !options.coefficient ) {
        options.coefficient = this.defaultCoefficient.timesInteger( options.sign );
      }

      // Choose location based on sign of the constant.
      // This determines which TermCreatorNode in the TermToolbox this term will animate to.
      assert && assert( !options.location, 'ConstantTermCreator sets location' );
      if ( options.coefficient.sign === 1 ) {
        options.location = this.positiveLocation;
      }
      else {
        options.location = this.negativeLocation;
      }

      return new VariableTerm( this.variable, options );
    },

    /**
     * Creates a new term by combining two terms.
     * @param {Term} term1
     * @param {Term} term2
     * @param {Object} options - passed to the combined VariableTerm's constructor
     * @returns {Term|null} - the combined term, null if the terms sum to zero
     * @public
     * @override
     */
    combineTerms: function( term1, term2, options ) {

      assert && assert( term1 instanceof VariableTerm, 'invalid term1: ' + term1 );
      assert && assert( term2 instanceof VariableTerm, 'invalid term2: ' + term2 );

      options = options || {};

      assert && assert( options.coefficient === undefined, 'VariableTermCreator sets coefficient' );
      options.coefficient = term1.coefficient.plus( term2.coefficient ).reduced();

      // If the coefficient is not zero, create a new term.
      var combinedTerm = null;
      if ( options.coefficient.getValue() !== 0 ) {
        combinedTerm = this.createTerm( options );
      }
      return combinedTerm;
    },

    /**
     * Does the specified term have a numerator or denominator that exceeds EqualityExplorerConstants.LARGEST_INTEGER?
     * @param {Term} term
     * @returns {boolean}
     * @public
     * @override
     */
    isNumberLimitExceeded: function( term ) {
      assert && assert( term instanceof VariableTerm, 'invalid term: ' + term );
      return ( Math.abs( term.coefficient.numerator ) > EqualityExplorerConstants.LARGEST_INTEGER ||
               Math.abs( term.coefficient.denominator ) > EqualityExplorerConstants.LARGEST_INTEGER );
    },

    /**
     * Copies the specified term, with possible modifications specified via options.
     * @param {Term} term
     * @param {Object} [options] - passed to the new VariableTerm's constructor
     * @returns {Term}
     * @public
     * @override
     */
    copyTerm: function( term, options ) {
      assert && assert( term instanceof VariableTerm, 'invalid term: ' + term );

      options = options || {};
      assert && assert( options.coefficient === undefined, 'VariableTermCreator sets coefficient' );
      options.coefficient = term.coefficient;

      return this.createTerm( options );
    },

    /**
     * Instantiates the Node that corresponds to this term.
     * @param {Term} term
     * @param {Object} options - passed to the VariableTermNode's constructor
     * @returns {TermNode}
     * @public
     * @override
     */
    createTermNode: function( term, options ) {

      options = _.extend( {
        positiveFill: this.positiveFill,
        negativeFill: this.negativeFill
      }, options );

      return new VariableTermNode( this, term, this.plate, options );
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
      var termOnPlate = this.plate.getTermInCell( this.likeTermsCellIndex ); // {ConstantTerm}
      var termDiameter = termOnPlate.diameter;
      var newCoefficient = null; // {Fraction|null}

      if ( termOnPlate ) {

        // there is a term on the plate, apply the operation if it's relevant
        if ( operation.operator === MathSymbols.PLUS && operation.operand instanceof VariableTerm ) {
          newCoefficient = termOnPlate.coefficient.plus( operation.operand.coefficient ).reduced();
        }
        else if ( operation.operator === MathSymbols.MINUS && operation.operand instanceof VariableTerm ) {
          newCoefficient = termOnPlate.coefficient.minus( operation.operand.coefficient ).reduced();
        }
        else if ( operation.operator === MathSymbols.TIMES && operation.operand instanceof ConstantTerm ) {
          newCoefficient = termOnPlate.coefficient.times( operation.operand.constantValue ).reduced();
        }
        else if ( operation.operator === MathSymbols.DIVIDE && operation.operand instanceof ConstantTerm ) {
          assert && assert( operation.operand.constantValue.getValue() !== 0, 'attempt to divide by zero' );
          newCoefficient = termOnPlate.coefficient.divided( operation.operand.constantValue ).reduced();
        }
      }
      else {

        // there is no term on the plate, create one if the operation is relevant
        if ( operation.operator === MathSymbols.PLUS ) {
          newCoefficient = operation.operand.coefficient;
         }
         else if ( operation.operator === MathSymbols.MINUS ) {
          newCoefficient = operation.operand.coefficient.timesInteger( -1 );
         }
      }

      if ( newCoefficient ) {

        // dispose of the term on the plate
        termOnPlate && termOnPlate.dispose();

        if ( newCoefficient.getValue() === 0 ) {
          summedToZero = true;
        }
        else {
          
          // create a new term on the plate
          this.createTermOnPlate( this.likeTermsCellIndex, {
            coefficient: newCoefficient,
            diameter: termDiameter
          } );
        }
      }

      return summedToZero;
    },

    /**
     * Is this term creator equivalent to a specified term creator?
     * @param {TermCreator} termCreator
     * @returns {boolean}
     * @public
     * @override
     */
    isEquivalentTo: function( termCreator ) {

      // VariableTermCreators are equivalent if they manage terms for the same variable.
      return ( termCreator instanceof VariableTermCreator ) && ( termCreator.variable === this.variable );
    },

    /**
     * Creates a lightweight data structure that describes the terms on the plate for this TermCreator.
     * The format of this data structure is specific VariableTermCreator.
     * @returns {{cellIndex: number, coefficient: Fraction, diameter: number}[]}
     * @public
     * @override
     */
    createSnapshot: function() {
      var snapshot = [];
      var termsOnPlate = this.getTermsOnPlate();
      for ( var i = 0; i < termsOnPlate.length; i++ ) {
        var term = termsOnPlate[ i ];
        assert && assert( term instanceof VariableTerm, 'invalid term: ' + term );
        snapshot.push( {
          cellIndex: this.plate.getCellForTerm( term ), // {number}
          coefficient: term.coefficient, // {Fraction}
          diameter: term.diameter // {number}
        } );
      }
      return snapshot;
    },

    /**
     * Restores a snapshot of terms on the plate for this TermCreator.
     * @param {*} snapshot - see return value of createSnapshot
     * @public
     * @override
     */
    restoreSnapshot: function( snapshot ) {
      for ( var i = 0; i < snapshot.length; i++ ) {
        this.createTermOnPlate( snapshot[ i ].cellIndex, {
          coefficient: snapshot[ i ].coefficient,
          diameter: snapshot[ i ].diameter
        } );
      }
    }
  } );
} );
 