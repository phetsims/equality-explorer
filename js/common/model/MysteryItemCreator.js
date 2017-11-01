// Copyright 2017, University of Colorado Boulder

/**
 * MysteryItemCreator creates and manages MysteryItems.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var AbstractItemCreator = require( 'EQUALITY_EXPLORER/common/model/AbstractItemCreator' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MysteryItem = require( 'EQUALITY_EXPLORER/common/model/MysteryItem' );

  /**
   * @param {number} weight
   * @param {Node} icon
   * @param {Node} iconShadow
   * @param {Object} [options]
   * @constructor
   */
  function MysteryItemCreator( weight, icon, iconShadow, options ) {

    // @private
    this._weight = weight;

    AbstractItemCreator.call( this, icon, iconShadow, options );
  }

  equalityExplorer.register( 'MysteryItemCreator', MysteryItemCreator );

  return inherit( AbstractItemCreator, MysteryItemCreator, {

    /**
     * Instantiates aItem.
     * @param {Vector2} location
     * @returns {MysteryItem}
     * @protected
     * @override
     */
    createItemProtected: function( location ) {
      return new MysteryItem( this._weight, this.icon, this.iconShadow, {
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
 