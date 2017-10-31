// Copyright 2017, University of Colorado Boulder

/**
 * MysteryItemCreator creates and manages MysteryItems (items whose weight is constant, but must be guessed).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemCreator = require( 'EQUALITY_EXPLORER/common/model/ItemCreator' );
  var MysteryItem = require( 'EQUALITY_EXPLORER/common/model/MysteryItem' );

  /**
   * @param {number} weight
   * @param {string} debugName - internal name, not displayed to the user
   * @param {Node} icon
   * @param {Node} iconShadow
   * @param {Object} [options]
   * @constructor
   */
  function MysteryItemCreator( weight, debugName, icon, iconShadow, options ) {

    // @private
    this._weight = weight;

    ItemCreator.call( this, debugName, icon, iconShadow, options );
  }

  equalityExplorer.register( 'MysteryItemCreator', MysteryItemCreator );

  return inherit( ItemCreator, MysteryItemCreator, {

    /**
     * Instantiates an Item.
     * @param {Vector2} location
     * @returns {Item}
     * @protected
     * @override
     */
    createItemProtected: function( location ) {
      return new MysteryItem( this.weight, this.debugName, this.icon, this.iconShadow, {
        location: location,
        dragBounds: this.dragBounds
      } );
    },

    /**
     * Gets the Item's weight.
     * @returns {number}
     * @public
     * @override
     */
    get weight() {
      return this._weight;
    }
  } );
} );
 