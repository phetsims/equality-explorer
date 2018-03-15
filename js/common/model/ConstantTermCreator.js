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
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var ReducedFraction = require( 'EQUALITY_EXPLORER/common/model/ReducedFraction' );
  var TermCreator = require( 'EQUALITY_EXPLORER/common/model/TermCreator' );
  var Util = require( 'DOT/Util' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function ConstantTermCreator( options ) {

    options = _.extend( {
      defaultConstantValue: ReducedFraction.withInteger( 1 ) // terms are created with this value by default
    }, options );

    assert && assert( options.defaultConstantValue instanceof ReducedFraction,
      'invalid defaultConstantValue: ' + options.defaultConstantValue );

    // @public (read-only) terms are created with this value by default
    this.defaultConstantValue = options.defaultConstantValue;

    var icon = ConstantTermNode.createInteractiveTermNode( options.defaultConstantValue );

    TermCreator.call( this, icon, options );
  }

  equalityExplorer.register( 'ConstantTermCreator', ConstantTermCreator );

  return inherit( TermCreator, ConstantTermCreator, {

    /**
     * Instantiates a ConstantTerm.
     * @param {Object} [options] - passed to the ConstantTerm's constructor
     * @returns {Term}
     * @protected
     * @override
     */
    createTermProtected: function( options ) {
      return new ConstantTerm( this, _.extend( {
        constantValue: this.defaultConstantValue
      }, options ) );
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

      var constantValue = term1.constantValue.plusFraction( term2.constantValue );
      var combinedTerm;

      if ( constantValue.toDecimal() === 0 ) {

        // terms summed to zero
        combinedTerm = null;
      }
      else {
        options.constantValue = constantValue;

        if ( Util.sign( options.constantValue.toDecimal() ) === Util.sign( this.defaultConstantValue.toDecimal() ) ) {

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
     * @param {Plate} plate
     * @param {Object} [options]  - passed to the ConstantTermNode's constructor
     * @returns {TermNode}
     * @public
     * @override
     */
    createTermNode: function( term, plate, options ) {
      return new ConstantTermNode( this, term, plate, options );
    },

    /**
     * Applies a universal operation to a term on the scale.
     * @param {UniversalOperation} operation
     * @param {Term} term
     * @returns {Term|null} the new term, null if the the operation resulted in zero
     * @public
     * @override
     */
    applyOperationToTerm: function( operation, term ) {
      assert && assert( this.combineLikeTermsEnabled, 'applyOperation is only supported when combining like terms' );
      assert && assert( term instanceof ConstantTerm, 'invalid term: ' + term );

      var cellIndex = this.plate.getCellForTerm( term );

      // compute the new constant value
      var constantValue;
      if ( operation.operator === MathSymbols.PLUS ) {
        constantValue = term.constantValue.plusInteger( operation.operand );
      }
      else if ( operation.operator === MathSymbols.MINUS ) {
        constantValue = term.constantValue.minusInteger( operation.operand );
      }
      else if ( operation.operator === MathSymbols.TIMES ) {
        constantValue = term.constantValue.timesInteger( operation.operand );
      }
      else if ( operation.operator === MathSymbols.DIVIDE ) {
        constantValue = term.constantValue.divideByInteger( operation.operand );
      }
      else {
        throw new Error( 'invalid operator: ' + operation.operator );
      }

      // Dispose of the term, has the side-effect of removing it from the plate.
      term.dispose();

      var newTerm = null;
      if ( constantValue.toDecimal() !== 0 ) {

        // create a new term on the plate
        var newTermOptions = {
          constantValue: constantValue,
          diameter: term.diameter
        };

        if ( Util.sign( constantValue.toDecimal() ) === Util.sign( this.defaultConstantValue.toDecimal() ) ) {

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

    /**
     * Applies a universal operation to the plate.
     * If there is already a like term on the plate, this is a no-op.
     * If not, a term is created on the plate.
     * @param {UniversalOperation} operation
     * @returns {Term|null} the term created, null if no term was created
     * @public
     * @abstract
     */
    applyOperationToPlate: function( operation ) {

      var term = null;

      // If the plate contains no like terms (no terms for this creator or its inverse)...
      if ( this.numberOfTermsOnPlateProperty.value === 0 &&
           this.inverseTermCreator.numberOfTermsOnPlateProperty.value === 0 &&
           // ... and the operator is one that creates constant terms...
           ( operation.operator === MathSymbols.PLUS || operation.operator === MathSymbols.MINUS ) ) {

        // compute the constant value
        var constantInteger = ( operation.operator === MathSymbols.PLUS ) ? operation.operand : -operation.operand;

        // If the constant has the same sign as this term, create a constant term on the plate
        if ( Util.sign( constantInteger ) === Util.sign( this.defaultConstantValue.toDecimal() ) ) {
          term = this.createTermOnPlate( this.likeTermsCellIndex, {
            constantValue: ReducedFraction.withInteger( constantInteger ),
            diameter: EqualityExplorerConstants.BIG_TERM_DIAMETER
          } );
        }
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
      return ( termCreator instanceof ConstantTermCreator ) &&
             ( termCreator.defaultConstantValue.toDecimal() === this.defaultConstantValue.toDecimal() ); // same values
    },

    /**
     * Creates a lightweight data structure that describes the terms on the plate for this TermCreator.
     * The format of this data structure is specific ConstantTermCreator.
     * @returns {{cellIndex: number, constantValue: ReducedFraction, diameter: number}[]}
     */
    createSnapshot: function() {
      var snapshot = [];
      var termsOnPlate = this.getTermsOnPlate();
      for ( var i = 0; i < termsOnPlate.length; i++ ) {
        var term = termsOnPlate[ i ];
        assert && assert( term instanceof ConstantTerm, 'invalid term:' + term );
        snapshot.push( {
          cellIndex: this.plate.getCellForTerm( term ),
          constantValue: term.constantValue,
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
          constantValue: snapshot[ i ].constantValue,
          diameter: snapshot[ i ].diameter
        } );
      }
    }
  } );
} );
 