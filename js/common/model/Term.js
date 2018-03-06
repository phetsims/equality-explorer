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
   * @param {TermCreator} termCreator - the term creator who created and manages this term
   * @param {Object} [options]
   * @constructor
   * @abstract
   */
  function Term( termCreator, options ) {

    options = _.extend( {
      diameter: EqualityExplorerConstants.SMALL_TERM_DIAMETER
    }, options );

    // @public (read-only)
    this.termCreator = termCreator;

    // @public (read-only)
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
     * Gets the weight of this term.
     * @returns {ReducedFraction}
     * @public
     * @abstract
     */
    get weight() {
      throw new Error( 'weight must be implemented by subtype' );
    },

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
     * @param {Term} term
     * @returns {boolean}
     * @public
     * @abstract
     */
    isInverseOf: function( term ) {
      throw new Error( 'isInverseOf must be implemented by subtype' );
    }
  } );
} );