// Copyright 2017, University of Colorado Boulder

/**
 * Abstract base type for terms in an equation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var Emitter = require( 'AXON/Emitter' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerMovable = require( 'EQUALITY_EXPLORER/common/model/EqualityExplorerMovable' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {Node} icon - the icon used to represent the term
   * @param {Node} shadow - the shadow displayed behind the icon when the term is being dragged
   * @param {Object} [options]
   * @constructor
   */
  function AbstractTerm( icon, shadow, options ) {

    // @public (read-only)
    this.icon = icon;
    this.shadow = shadow;

    // @public (read-only) emit1 when dispose has completed.
    // Callback signature is function( {AbstractTerm} term ), where the parameter is the term that was disposed.
    this.disposedEmitter = new Emitter();

    // @public controls whether the term's shadow is visible
    this.shadowVisibleProperty = new BooleanProperty( false );

    EqualityExplorerMovable.call( this, options );
  }

  equalityExplorer.register( 'AbstractTerm', AbstractTerm );

  return inherit( EqualityExplorerMovable, AbstractTerm, {

    /**
     * Gets the term's weight
     * @returns {number}
     * @public
     * @abstract
     */
    get weight() {
      throw new Error( 'weight getter must be implemented by subtype' );
    },

    /**
     * @public
     * @override
     */
    dispose: function() {
      this.disposedEmitter.emit1( this );
      this.disposedEmitter.removeAllListeners();
      EqualityExplorerMovable.prototype.dispose.call( this );
    },

    /**
     * Is this term the inverse of a specified term?
     * Two terms are inverses if they have identical types, and their weights sum to zero.
     * @param {AbstractTerm} term
     * @returns {boolean}
     * @public
     */
    isInverseOf: function( term ) {
      return ( this.constructor === term.constructor ) && ( this.weight + term.weight === 0 );
    }
  } );
} );
