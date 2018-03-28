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
  var ConstantTermOperand = require( 'EQUALITY_EXPLORER/common/model/ConstantTermOperand' );
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

    options = _.extend( {
      defaultConstantValue: Fraction.fromInteger( 1 ) // terms are created with this value by default
    }, options );

    assert && assert( options.defaultConstantValue instanceof Fraction,
      'invalid defaultConstantValue: ' + options.defaultConstantValue );
    assert && assert( options.defaultConstantValue.isReduced(),
      'defaultConstantValue must be reduced: ' + options.defaultConstantValue );

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

      options = _.extend( {
        constantValue: this.defaultConstantValue
      }, options );

      return new ConstantTerm( this, options );
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
      assert && assert( this.inverseTermCreator, 'combineTerms requires an inverseTermCreator' );

      options = options || {};

      assert && assert( !options.constantValue, 'ConstantTermCreator sets constantValue' );
      options.constantValue = term1.constantValue.plus( term2.constantValue ).reduced();

      // If the constant is not zero, create a new term.
      var combinedTerm = null;
      if ( options.constantValue.getValue() !== 0 ) {

        if ( options.constantValue.sign === this.defaultConstantValue.sign ) {

          // Sign is the same as this term creator, so create the term.
          combinedTerm = this.createTerm( options );
        }
        else {

          // Sign is different than this term creator, so forward the creation request to the inverse term creator.
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
     * Applies a universal operation to a term on the plate.
     * @param {UniversalOperation} operation
     * @param {Term} term
     * @returns {Term|null} the new term, null if the the operation resulted in zero
     * @public
     * @override
     */
    applyOperationToTerm: function( operation, term ) {
      assert && assert( this.combineLikeTermsEnabled, 'applyOperationToTerm is only supported when combining like terms' );
      assert && assert( term instanceof ConstantTerm, 'invalid term: ' + term );

      if ( !( operation.operand instanceof ConstantTermOperand ) ) {
        return term; // operand is not applicable to constant terms
      }

      var constantValue = operation.operand.constantValue; // {Fraction}
      var cellIndex = this.plate.getCellForTerm( term );

      // compute the new constant value
      var newConstantValue;
      if ( operation.operator === MathSymbols.PLUS ) {
        newConstantValue = term.constantValue.plus( constantValue ).reduced();
      }
      else if ( operation.operator === MathSymbols.MINUS ) {
        newConstantValue = term.constantValue.minus( constantValue ).reduced();
      }
      else if ( operation.operator === MathSymbols.TIMES ) {
        newConstantValue = term.constantValue.times( constantValue ).reduced();
      }
      else if ( operation.operator === MathSymbols.DIVIDE && constantValue.getValue() !== 0 ) {
        newConstantValue = term.constantValue.divided( constantValue ).reduced();
      }
      else {
        return term; // operation is not applicable
      }

      // Dispose of the term, has the side-effect of removing it from the plate.
      term.dispose();

      // If the new constant isn't zero, create a new term on the plate.
      var newTerm = null;
      if ( newConstantValue.getValue() !== 0 ) {
        newTerm = this.delegateCreateTermOnPlate( cellIndex, {
          constantValue: newConstantValue,
          diameter: term.diameter
        } );
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
     * @override
     */
    applyOperationToPlate: function( operation ) {
      assert && assert( this.combineLikeTermsEnabled, 'applyOperationToPlate is only supported when combining like terms' );
      assert && assert( this.inverseTermCreator, 'applyOperationToPlate requires an inverseTermCreator' );

      // operator is not applicable to constant terms
      if ( operation.operator !== MathSymbols.PLUS && operation.operator !== MathSymbols.MINUS ) {
        return null;
      }

      // operand is not a like term
      if ( !( operation.operand instanceof ConstantTermOperand ) ) {
        return null;
      }

      // the plate already contains one or more like terms
      if ( this.numberOfTermsOnPlateProperty.value + this.inverseTermCreator.numberOfTermsOnPlateProperty.value !== 0 ) {
        return null;
      }

      // {Fraction} compute the constant value
      var constantValue = ( operation.operator === MathSymbols.PLUS ) ?
                          operation.operand.constantValue : operation.operand.constantValue.timesInteger( -1 );

      // create a new term on the plate
      return this.delegateCreateTermOnPlate( this.likeTermsCellIndex, {
        constantValue: constantValue,
        diameter: EqualityExplorerConstants.BIG_TERM_DIAMETER
      } );
    },

    /**
     * Creates a term on the plate, possibly delegating creation to the inverse term creator.
     * For example, if the positive constant creator is asked to create '-2', it will delegate to the negative
     * constant creator.
     * @param {number} cellIndex
     * @param {Object} options - passed to the ConstantTerm's constructor
     * @returns {Term}
     * @private
     */
    delegateCreateTermOnPlate: function( cellIndex, options ) {

      options = _.extend( {
        constantValue: this.defaultConstantValue,
        diameter: EqualityExplorerConstants.SMALL_TERM_DIAMETER
      }, options );

      var term = null;
      if ( options.constantValue.sign === this.defaultConstantValue.sign ) {

        // Sign is the same as this term creator, so create the term.
        term = this.createTermOnPlate( cellIndex, options );
      }
      else {

        // Sign is different than this term creator, so forward the creation request to the inverse term creator.
        term = this.inverseTermCreator.createTermOnPlate( cellIndex, options );
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
             ( termCreator.defaultConstantValue.getValue() === this.defaultConstantValue.getValue() ); // same values
    },

    /**
     * Is this term creator the inverse of a specified term creator?
     * @param {TermCreator} termCreator
     * @returns {boolean}
     * @public
     * @override
     */
    isInverseOf: function( termCreator ) {
      return ( termCreator instanceof ConstantTermCreator ) &&
             ( termCreator.defaultConstantValue.getValue() === -this.defaultConstantValue.getValue() ); // inverse values
    },

    /**
     * Creates a lightweight data structure that describes the terms on the plate for this TermCreator.
     * The format of this data structure is specific ConstantTermCreator.
     * @returns {{cellIndex: number, constantValue: Fraction, diameter: number}[]}
     * @public
     * @override
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
     * @public
     * @override
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
 