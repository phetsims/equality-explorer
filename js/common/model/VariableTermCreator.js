// Copyright 2017-2018, University of Colorado Boulder

/**
 * VariableTermCreator creates and manages variable terms (e.g. 'x').
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ConstantTermOperand = require( 'EQUALITY_EXPLORER/common/model/ConstantTermOperand' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerColors = require( 'EQUALITY_EXPLORER/common/EqualityExplorerColors' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var Fraction = require( 'PHETCOMMON/model/Fraction' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var TermCreator = require( 'EQUALITY_EXPLORER/common/model/TermCreator' );
  var VariableTerm = require( 'EQUALITY_EXPLORER/common/model/VariableTerm' );
  var VariableTermNode = require( 'EQUALITY_EXPLORER/common/view/VariableTermNode' );
  var VariableTermOperand = require( 'EQUALITY_EXPLORER/common/model/VariableTermOperand' );

  /**
   * @param {string} symbol
   * @param {NumberProperty} variableValueProperty
   * @param {Object} [options]
   * @constructor
   */
  function VariableTermCreator( symbol, variableValueProperty, options ) {

    assert && assert( variableValueProperty instanceof NumberProperty,
      'invalid variableValueProperty: ' + variableValueProperty );

    var self = this;

    options = _.extend( {
      defaultCoefficient: Fraction.withInteger( 1 ), // terms are created with this coefficient by default
      positiveFill: EqualityExplorerColors.POSITIVE_X_FILL,
      negativeFill: EqualityExplorerColors.NEGATIVE_X_FILL
    }, options );

    assert && assert( options.defaultCoefficient instanceof Fraction,
      'invalid defaultCoefficient: ' + options.defaultCoefficient );
    assert && assert( options.defaultCoefficient.isReduced(),
      'defaultCoefficient must be reduced: ' + options.defaultCoefficient );

    // @public (read-only)
    this.symbol = symbol;
    this.defaultCoefficient = options.defaultCoefficient;
    this.variableValueProperty = variableValueProperty;

    // @private
    this.positiveFill = options.positiveFill;
    this.negativeFill = options.negativeFill;

    var icon = VariableTermNode.createInteractiveTermNode( options.defaultCoefficient, symbol, {
      positiveFill: options.positiveFill,
      negativeFill: options.negativeFill
    } );

    TermCreator.call( this, icon, options );

    // When the variable values changes, recompute the weight of terms on the scale.
    // dispose not needed.
    this.variableValueProperty.link( function( variableValue ) {
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
      var sum = Fraction.withInteger( 0 );
      for ( var i = 0; i < this.termsOnPlate.length; i++ ) {
        sum = sum.plus( this.termsOnPlate.get( i ).coefficient ).reduced();
      }
      return sum;
    },

    /**
     * Instantiates a VariableTerm.
     * @param {Object} [options] - passed to the VariableTerm's constructor
     * @returns {Term}
     * @protected
     * @override
     */
    createTermProtected: function( options ) {
      return new VariableTerm( this.symbol, this.variableValueProperty, this, _.extend( {
        coefficient: this.defaultCoefficient
      }, options ) );
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

      var coefficient = term1.coefficient.plus( term2.coefficient ).reduced();
      var combinedTerm;

      if ( coefficient.getValue() === 0 ) {

        // terms summed to zero
        combinedTerm = null;
      }
      else {
        options.coefficient = coefficient;

        if ( options.coefficient.sign === this.defaultCoefficient.sign ) {

          // sign is the same as this term creator, so create the term
          combinedTerm = this.createTerm( options );
        }
        else {

          // sign of the combined term doesn't match this term creator,
          // forward the creation request to the inverse term creator.
          combinedTerm = this.inverseTermCreator.createTerm( options );
        }
      }
      return combinedTerm;
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
     * @param {Plate} plate
     * @param {Object} options - passed to the VariableTermNode's constructor
     * @returns {TermNode}
     * @public
     * @override
     */
    createTermNode: function( term, plate, options ) {

      options = _.extend( {
        positiveFill: this.positiveFill,
        negativeFill: this.negativeFill
      }, options );

      return new VariableTermNode( this, term, plate, options );
    },

    //TODO 2 returns from this function
    /**
     * Applies a universal operation to a term on the scale.
     * @param {UniversalOperation} operation
     * @param {Term} term
     * @returns {Term|null} same term if the operation is irrelevant,
     *                      new term if the operation is relevant,
     *                      null if the the operation resulted in zero
     * @public
     * @override
     */
    applyOperationToTerm: function( operation, term ) {
      assert && assert( this.combineLikeTermsEnabled, 'applyOperationToTerm is only supported when combining like terms' );
      assert && assert( term instanceof VariableTerm, 'invalid term: ' + term );

      var cellIndex = this.plate.getCellForTerm( term );

      // {Fraction} compute the new coefficient value
      var newCoefficient;
      if ( operation.operator === MathSymbols.PLUS && operation.operand instanceof VariableTermOperand ) {
        newCoefficient = term.coefficient.plus( operation.operand.coefficient ).reduced();
      }
      else if ( operation.operator === MathSymbols.MINUS && operation.operand instanceof VariableTermOperand ) {
        newCoefficient = term.coefficient.minus( operation.operand.coefficient ).reduced();
      }
      else if ( operation.operator === MathSymbols.TIMES && operation.operand instanceof ConstantTermOperand ) {
        newCoefficient = term.coefficient.times( operation.operand.constantValue ).reduced();
      }
      else if ( operation.operator === MathSymbols.DIVIDE && operation.operand instanceof ConstantTermOperand &&
                operation.operand.constantValue.getValue() !== 0 ) {
        newCoefficient = term.coefficient.divided( operation.operand.constantValue ).reduced();
      }
      else {
        return term; // operation is not applicable to this term
      }

      // Dispose of the term, has the side-effect of removing it from the plate.
      term.dispose();

      var newTerm = null;
      if ( newCoefficient.getValue() !== 0 ) {

        // create a new term on the plate
        var newTermOptions = {
          coefficient: newCoefficient,
          diameter: term.diameter
        };

        if ( newCoefficient.sign === this.defaultCoefficient.sign ) {

          // sign is the same as this term creator, so create the term
          newTerm = this.createTermOnPlate( cellIndex, newTermOptions );
        }
        else {

          // sign is different than this term creator, forward the creation request to the inverse term creator.
          newTerm = this.inverseTermCreator.createTermOnPlate( cellIndex, newTermOptions );
        }
      }

      return newTerm;
    },

    //TODO 4 returns from this function
    /**
     * Applies a universal operation to the plate.
     * @param {UniversalOperation} operation
     * @returns {Term|null} the term created, null if no term was created
     * @public
     * @override
     */
    applyOperationToPlate: function( operation ) {
      assert && assert( this.combineLikeTermsEnabled, 'applyOperationToPlate is only supported when combining like terms' );

      if ( operation.operator !== MathSymbols.PLUS && operation.operator !== MathSymbols.MINUS ) {
        return null; // operator is not applicable to variable terms
      }

      if ( !( operation.operand instanceof VariableTermOperand && operation.operand.symbol === this.symbol ) ) {
        return null; // operand is not applicable to this variable term
      }

      // the plate already contains one or more like terms
      if( this.numberOfTermsOnPlateProperty.value + this.inverseTermCreator.numberOfTermsOnPlateProperty.value !== 0 ) {
        return null;
      }

      var term = null;

      // {Fraction} compute the coefficient
      var coefficient = ( operation.operator === MathSymbols.PLUS ) ?
                        operation.operand.coefficient : operation.operand.coefficient.timesInteger( -1 );

      // If the coefficient has the same sign as this term, create a coefficient term on the plate.
      // Otherwise do nothing because the inverse term creator will create the term.
      if ( coefficient.sign === this.defaultCoefficient.sign ) {
        term = this.createTermOnPlate( this.likeTermsCellIndex, {
          coefficient: coefficient,
          diameter: EqualityExplorerConstants.BIG_TERM_DIAMETER
        } );
      }

      return term;
    },

    /**
     * Is this term creator equivalent to a specified term creator?
     * @param {TermCreator} termCreator
     * @returns {boolean}
     * @public
     * @override
     */
    isEquivalentTo: function( termCreator ) {
      return ( termCreator.constructor === this.constructor ) &&  // same type
             ( termCreator.variableValueProperty === this.variableValueProperty ) && // same variable
             ( termCreator.defaultCoefficient.getValue() === this.defaultCoefficient.getValue() ); // same coefficients
    },

    /**
     * Creates a lightweight data structure that describes the terms on the plate for this TermCreator.
     * The format of this data structure is specific VariableTermCreator.
     * @returns {{cellIndex: number, coefficient: Fraction, diameter: number}[]}
     */
    createSnapshot: function() {
      var snapshot = [];
      var termsOnPlate = this.getTermsOnPlate();
      for ( var i = 0; i < termsOnPlate.length; i++ ) {
        var term = termsOnPlate[ i ];
        assert && assert( term instanceof VariableTerm, 'invalid term: ' + term );
        snapshot.push( {
          cellIndex: this.plate.getCellForTerm( term ),
          coefficient: term.coefficient,
          diameter: term.diameter
        } );
      }
      return snapshot;
    },

    /**
     * Restores a snapshot of terms on the plate for this TermCreator.
     * @param {*} snapshot - see return value of createSnapshot
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
 