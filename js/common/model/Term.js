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
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {Object} [options]
   * @constructor
   * @abstract
   */
  function Term( options ) {

    options = _.extend( {
      diameter: EqualityExplorerConstants.SMALL_TERM_DIAMETER
    }, options );

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
     * Gets the sign of the term's significant number, indicating whether the number is positive, negative or zero.
     * The meaning on 'significant number' is specific to the Term subtype.
     * @returns {number} ala Math.sign
     * @public
     * @abstract
     */
    get sign() {
      throw new Error( 'sign must be implemented by subtype' );
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