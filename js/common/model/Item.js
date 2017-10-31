// Copyright 2017, University of Colorado Boulder

/**
 * Base type for items that can be placed on the scale.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Emitter = require( 'AXON/Emitter' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerMovable = require( 'EQUALITY_EXPLORER/common/model/EqualityExplorerMovable' );
  var inherit = require( 'PHET_CORE/inherit' );

  var idIndex = 0; // unique number assigned to each Item instance, for debugging purposes

  /**
   * @param {string} debugName - internal name, not displayed to the user
   * @param {Node} icon
   * @param {Node} iconShadow
   * @param {Object} [options]
   * @constructor
   */
  function Item( debugName, icon, iconShadow, options ) {

    // @private
    this.id = idIndex++;

    // @public (read-only)
    this.debugName = debugName;
    this.icon = icon;
    this.iconShadow = iconShadow;
    this.disposedEmitter = new Emitter(); // emit1 when Item.dispose has completed

    EqualityExplorerMovable.call( this, options );
  }

  equalityExplorer.register( 'Item', Item );

  return inherit( EqualityExplorerMovable, Item, {

    /**
     * Gets the Item's weight
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
     * @returns {string}
     * @public
     */
    toString: function() {
      return this.debugName + this.id;
    }
  } );
} );
