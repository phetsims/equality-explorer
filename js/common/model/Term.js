// Copyright 2017-2018, University of Colorado Boulder

/**
 * Abstract base type for terms.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var EqualityExplorerMovable = require( 'EQUALITY_EXPLORER/common/model/EqualityExplorerMovable' );
  var Fraction = require( 'PHETCOMMON/model/Fraction' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Util = require( 'DOT/Util' );

  /**
   * @param {Fraction} significantValue
   * @param {Object} [options]
   * @constructor
   * @abstract
   */
  function Term( significantValue, options ) {

    assert && assert( significantValue instanceof Fraction, 'invalid significantValue: ' + significantValue );
    assert && assert( significantValue.isReduced(), 'significantValue must be reduced: ' + significantValue );

    options = _.extend( {
      diameter: EqualityExplorerConstants.SMALL_TERM_DIAMETER
    }, options );

    // @private the value that is significant for the purposes of determining sign and number limits.
    // The value is that significant is specific to the Term subtype.
    this.significantValue = significantValue;

    // @public (read-only)
    // Sign of the term's significant number, ala Math.sign.
    // Note that sign is not related to the term's weight. For example, for variable terms, the 'significant number'
    // is the coefficient. Consider term '-5x', where x=-2. While the weight is 10 (-5 * -2), the sign is based on
    // the coefficient -5, and is therefore -1.
    this.sign = Util.sign( significantValue.getValue() );

    // @public (read-only) diameter of the term in the view, convenient to store in the model
    this.diameter = options.diameter;

    // @public whether the term's shadow is visible
    this.shadowVisibleProperty = new BooleanProperty( false );

    // @public whether the term's halo is visible
    this.haloVisibleProperty = new BooleanProperty( false );

    EqualityExplorerMovable.call( this, options );
  }

  equalityExplorer.register( 'Term', Term );

  return inherit( EqualityExplorerMovable, Term, {

    /**
     * @public
     * @override
     */
    dispose: function() {
      this.shadowVisibleProperty.dispose();
      this.haloVisibleProperty.dispose();
      EqualityExplorerMovable.prototype.dispose.call( this );
    },

    /**
     * Is this term the inverse of a specified term?
     * Inverse terms are like terms with opposite signs. E.g. x and -x, 1 and -1.
     * @param {Term} term
     * @returns {boolean}
     * @public
     */
    isInverseTerm: function( term ) {
      return ( this.isLikeTerm( term ) && ( this.sign === -term.sign ) );
    },

    /**
     * Does this term have a numerator or denominator that exceeds EqualityExplorerConstants.LARGEST_INTEGER?
     * See https://github.com/phetsims/equality-explorer/issues/48
     * @returns {boolean}
     * @public
     */
    isNumberLimitExceeded: function() {
      return ( Math.abs( this.significantValue.numerator ) > EqualityExplorerConstants.LARGEST_INTEGER ||
               Math.abs( this.significantValue.denominator ) > EqualityExplorerConstants.LARGEST_INTEGER );
    },

    /**
     * Creates options that can be passed to the Term's constructor to re-create the Term.
     * Subtypes that have additional options to add should override this method and add to the options returned here.
     * @return {Object|null} - details that are specific to Term subtype
     * @public
     */
    createSnapshot: function() {
      return {
        diameter: this.diameter
      };
    },

    //-------------------------------------------------------------------------------------------------
    // Below here are @abstract methods, to be implemented by subtypes
    //-------------------------------------------------------------------------------------------------

    /**
     * Gets the weight of this term.
     * @returns {Fraction}
     * @public
     * @abstract
     */
    get weight() {
      throw new Error( 'weight must be implemented by subtype' );
    },

    /**
     * Are this term and the specified term 'like terms'?
     * If you're not familiar with 'like terms', see https://en.wikipedia.org/wiki/Like_terms.
     * @param {Term} term
     * @returns {boolean}
     * @public
     * @abstract
     */
    isLikeTerm: function( term ) {
      throw new Error( 'isLikeTerm must be implemented by subtype' );
    }
  } );
} );