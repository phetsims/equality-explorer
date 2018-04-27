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
  var TermCreator = require( 'EQUALITY_EXPLORER/common/model/TermCreator' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function ConstantTermCreator( options ) {
    TermCreator.call( this, options );
  }

  equalityExplorer.register( 'ConstantTermCreator', ConstantTermCreator );

  return inherit( TermCreator, ConstantTermCreator, {

    /**
     * Returns the sum of constant values for all terms on the plate.
     * @returns {RationalNumber}
     * @public
     */
    sumConstantsOnPlate: function() {
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

      var constantValue = EqualityExplorerConstants.DEFAULT_CONSTANT_VALUE.timesInteger( options.sign );
      return ConstantTermNode.createInteractiveTermNode( constantValue );
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
        options.constantValue = EqualityExplorerConstants.DEFAULT_CONSTANT_VALUE.timesInteger( options.sign );
      }

      return new ConstantTerm( options );
    },

    /**
     * Creates a term whose significant value is zero. The term is not managed by the TermCreator.
     * This is used when applying an operation to an empty plate.
     * @param {Object} [options] - ConstantTerm options
     * @returns {Term}
     * @public
     * @override
     */
    createZeroTerm: function( options ) {
      options = options || {};
      assert && assert( !options.constantValue, 'ConstantTermCreator sets constantValue' );
      options.constantValue = Fraction.fromInteger( 0 );
      return this.createTermProtected( options );
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
      return new ConstantTermNode( this, term, options );
    }
  } );
} );
 