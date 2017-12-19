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
   * @param {Node} icon
   * @param {Node} shadow
   * @param {Object} [options]
   * @constructor
   */
  function MysteryItemCreator( icon, shadow, options ) {

    options = _.extend( {
      weight: 1  // weight of each item that is created
    }, options );

    // @private
    this._weight = options.weight;

    AbstractItemCreator.call( this, icon, shadow, options );
  }

  equalityExplorer.register( 'MysteryItemCreator', MysteryItemCreator );

  return inherit( AbstractItemCreator, MysteryItemCreator, {

    /**
     * Instantiates a MysteryItem.
     * @param {Vector2} location
     * @returns {AbstractItem}
     * @protected
     * @override
     */
    createItemProtected: function( location ) {
      return new MysteryItem( this._weight, this.icon, this.shadow, {
        location: location,
        dragBounds: this.dragBounds
      } );
    },

    /**
     * Gets the item's weight.
     * @returns {number}
     * @public
     * @override
     */
    get weight() {
      return this._weight;
    }
  } );
} );
 