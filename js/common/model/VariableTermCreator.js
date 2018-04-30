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
  var EqualityExplorerColors = require( 'EQUALITY_EXPLORER/common/EqualityExplorerColors' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var Fraction = require( 'PHETCOMMON/model/Fraction' );
  var inherit = require( 'PHET_CORE/inherit' );
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
    this.positiveFill = options.positiveFill;
    this.negativeFill = options.negativeFill;

    TermCreator.call( this, options );

    // When the variable values changes, recompute the weight of terms on the scale.
    // unlink not needed.
    this.variable.valueProperty.link( function( variableValue ) {
      self.updateWeightOnPlateProperty();
    } );
  }

  equalityExplorer.register( 'VariableTermCreator', VariableTermCreator );

  return inherit( TermCreator, VariableTermCreator, {

    /**
     * Returns the sum of coefficients for all terms on the plate.
     * @returns {RationalNumber}
     * @public
     */
    sumCoefficientsOnPlate: function() {
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

      var coefficient = EqualityExplorerConstants.DEFAULT_COEFFICIENT.timesInteger( options.sign );
      return VariableTermNode.createInteractiveTermNode( coefficient, this.variable.symbol, {
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

      // If the coefficient wasn't specified, use the default.
      options.coefficient = options.coefficient || EqualityExplorerConstants.DEFAULT_COEFFICIENT;

      // Adjust the sign
      options.coefficient = options.coefficient.timesInteger( options.sign );

      return new VariableTerm( this.variable, options );
    },

    /**
     * Creates a term whose significant value is zero. This is used when applying an operation to an empty plate.
     * The term is not managed by the TermCreator.
     * @param {Object} [options] - VariableTerm options
     * @returns {Term}
     * @public
     * @override
     */
    createZeroTerm: function( options ) {
      options = options || {};
      assert && assert( !options.coefficient, 'VariableTermCreator sets coefficient' );
      options.coefficient = Fraction.fromInteger( 0 );
      return this.createTermProtected( options );
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
      return new VariableTermNode( this, term, _.extend( {
        positiveFill: this.positiveFill,
        negativeFill: this.negativeFill
      }, options ) );
    }
  } );
} );
 