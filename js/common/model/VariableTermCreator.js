// Copyright 2017-2018, University of Colorado Boulder

/**
 * VariableTermCreator creates and manages variable terms (e.g. 'x').
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var ReducedFraction = require( 'EQUALITY_EXPLORER/common/model/ReducedFraction' );
  var TermCreator = require( 'EQUALITY_EXPLORER/common/model/TermCreator' );
  var VariableTerm = require( 'EQUALITY_EXPLORER/common/model/VariableTerm' );
  var VariableTermNode = require( 'EQUALITY_EXPLORER/common/view/VariableTermNode' );
  var Util = require( 'DOT/Util' );

  /**
   * @param {string} symbol
   * @param {NumberProperty} variableValueProperty
   * @param {Object} [options]
   * @constructor
   */
  function VariableTermCreator( symbol, variableValueProperty, options ) {

    assert && assert( variableValueProperty instanceof NumberProperty, 'invalid variableValueProperty' );

    var self = this;

    options = _.extend( {
      defaultCoefficient: ReducedFraction.withInteger( 1 ), // terms are created with this coefficient by default
      positiveFill: 'rgb( 49, 193, 238 )',
      negativeFill: 'rgb( 99, 212, 238 )'
    }, options );

    assert && assert( options.defaultCoefficient instanceof ReducedFraction, 'invalid defaultCoefficient' );

    // @public (read-only)
    this.symbol = symbol;
    this.defaultCoefficient = options.defaultCoefficient;
    this.variableValueProperty = variableValueProperty;

    // @private
    this.positiveFill = options.positiveFill;
    this.negativeFill = options.negativeFill;

    var icon = VariableTermNode.createIcon( symbol, options.defaultCoefficient, {
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
      var sum = ReducedFraction.withInteger( 0 );
      for ( var i = 0; i < this.termsOnPlate.length; i++ ) {
        sum = sum.plusFraction( this.termsOnPlate.get( i ).coefficient );
      }
      return sum;
    },

    /**
     * Instantiates a VariableTerm.
     * @param {Object} [options] - passed to the Term's constructor
     * @returns {Term}
     * @protected
     * @override
     */
    createTermProtected: function( options ) {

      options = _.extend( {
        location: this.location,
        dragBounds: this.dragBounds,
        coefficient: this.defaultCoefficient
      }, options );

      return new VariableTerm( this.symbol, this.variableValueProperty, this, options );
    },

    /**
     * Creates a new term by combining two terms.
     * @param {Term} term1
     * @param {Term} term2
     * @param {Object} options - passed to the combined Term's constructor
     * @returns {Term|null} - the combined term, null if the terms sum to zero
     * @public
     * @override
     */
    combineTerms: function( term1, term2, options ) {

      assert && assert( term1 instanceof VariableTerm, 'invalid term1' );
      assert && assert( term2 instanceof VariableTerm, 'invalid term2' );

      options = options || {};
      assert && assert( options.coefficient === undefined, 'VariableTermCreator sets coefficient' );

      var coefficient = term1.coefficient.plusFraction( term2.coefficient );
      var combinedTerm;

      if ( coefficient.toDecimal() === 0 ) {

        // terms summed to zero
        combinedTerm = null;
      }
      else {
        options.coefficient = coefficient;

        if ( Util.sign( options.coefficient.toDecimal() ) === Util.sign( this.defaultCoefficient.toDecimal() ) ) {

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
     * @param {Object} [options] - passed to the new Term's constructor
     * @returns {Term}
     */
    copyTerm: function( term, options ) {
      assert && assert( term instanceof VariableTerm, 'invalid term' );

      options = options || {};
      assert && assert( options.coefficient === undefined, 'VariableTermCreator sets coefficient' );
      options.coefficient = term.coefficient;

      return this.createTerm( options );
    },

    /**
     * Instantiates the Node that corresponds to this term.
     * @param {Term} term
     * @param {Plate} plate
     * @param {Object} options - passed to the TermNode's constructor
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

    /**
     * Applies a universal operation to terms on the scale.
     * @param {UniversalOperation} operation
     * @param {Term} term
     * @public
     * @override
     */
    applyOperation: function( operation, term ) {
      assert && assert( this.combineLikeTerms, 'applyOperation is only supported when combining like terms' );
      assert && assert( term instanceof VariableTerm, 'invalid term' );

      // addition and subtraction are not relevant
      if ( operation.operator === MathSymbols.PLUS || operation.operator === MathSymbols.MINUS ) {
        return;
      }

      var cellIndex = this.plate.getCellForTerm( term );

      // compute the new coefficient value
      var coefficient;
      if ( operation.operator === MathSymbols.TIMES ) {
        coefficient = term.coefficient.timesInteger( operation.operand );
      }
      else if ( operation.operator === MathSymbols.DIVIDE ) {
        coefficient = term.coefficient.divideByInteger( operation.operand );
      }
      else {
        throw new Error( 'unsupported operand: ' + operation.operand );
      }

      // Dispose of the term, has the side-effect of removing it from the plate.
      term.dispose();

      if ( coefficient.toDecimal() === 0 ) {
        //TODO sum-to-zero animation without halo, *after* operation has been applied to all terms, and scale has moved
      }
      else {

        // create a new term on the plate
        var newTermOptions = {
          coefficient: coefficient,
          diameter: EqualityExplorerConstants.BIG_TERM_DIAMETER
        };

        if ( Util.sign( coefficient.toDecimal() ) === Util.sign( this.defaultCoefficient.toDecimal() ) ) {

          // sign is the same as this term creator, so create the term
          this.createTermOnPlate( cellIndex, newTermOptions );
        }
        else {

          // sign is different than this term creator, forward the creation request to the inverse term creator.
          this.inverseTermCreator.createTermOnPlate( cellIndex, newTermOptions );
        }
      }
    },

    /**
     * Is this term creator the inverse of a specified term creator?
     * @param {TermCreator} termCreator
     * @returns {boolean}
     * @public
     * @override
     */
    isInverseOf: function( termCreator ) {
      return ( termCreator.constructor === this.constructor ) &&  // same type
             ( termCreator.variableValueProperty === this.variableValueProperty ) && // same variable
             ( termCreator.defaultCoefficient.toDecimal() + this.defaultCoefficient.toDecimal() === 0 ); // coefficients sum to zero
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
             ( termCreator.defaultCoefficient.toDecimal() === this.defaultCoefficient.toDecimal() ); // same coefficients
    }
  } );
} );
 