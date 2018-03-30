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
     * Gets the sign of a term.
     * @returns {number} ala Math.sign
     * @public
     * @abstract
     */
    get sign() {
      throw new Error( 'sign must be implemented by subtype' );
    },

    /**
     * Is this term a like term?
     * @param {Term} term
     * @returns {boolean}
     * @public
     * @abstract
     */
    isLikeTerm: function( term ) {
      throw new Error( 'isLikeTerm must be implemented by subtype' );
    },

    /**
     * Is this term the inverse of a specified term?
     * @param {Term} term
     * @returns {boolean}
     * @public
     * @abstract
     */
    isInverseTerm: function( term ) {
      throw new Error( 'isInverseTerm must be implemented by subtype' );
    }
  } );
} );