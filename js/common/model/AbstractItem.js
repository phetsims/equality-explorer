// Copyright 2017, University of Colorado Boulder

/**
 * Abstract base type for items that can be placed on the scale.
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
   * @param {Node} icon
   * @param {Node} shadow
   * @param {Object} [options]
   * @constructor
   */
  function AbstractItem( icon, shadow, options ) {

    // @public (read-only)
    this.icon = icon;
    this.shadow = shadow;
    this.disposedEmitter = new Emitter(); // emit1 when dispose has completed

    // @public
    this.shadowVisibleProperty = new BooleanProperty( false );

    EqualityExplorerMovable.call( this, options );
  }

  equalityExplorer.register( 'AbstractItem', AbstractItem );

  return inherit( EqualityExplorerMovable, AbstractItem, {

    /**
     * Gets the item's weight
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
     * Is this item the inverse of a specified item?
     * Two items are inverses if they have identical types, and their weights sum to zero.
     * @param {AbstractItem} item
     * @returns {boolean}
     * @public
     */
    isInverseOf: function( item ) {
      return ( this.constructor === item.constructor ) && ( this.weight + item.weight === 0 );
    }
  } );
} );
