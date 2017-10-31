// Copyright 2017, University of Colorado Boulder

/**
 * ConstantItemCreator creates items of type ConstantItem (constants).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ConstantItem = require( 'EQUALITY_EXPLORER/common/model/ConstantItem' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemCreator = require( 'EQUALITY_EXPLORER/common/model/ItemCreator' );

  /**
   * @param {number} weight
   * @param {string} debugName - internal name, not displayed to the user
   * @param {Node} icon
   * @param {Node} iconShadow
   * @param {Object} [options]
   * @constructor
   */
  function ConstantItemCreator( weight, debugName, icon, iconShadow, options ) {

    // @private
    this._weight = weight;

    ItemCreator.call( this, debugName, icon, iconShadow, options );
  }

  equalityExplorer.register( 'ConstantItemCreator', ConstantItemCreator );

  return inherit( ItemCreator, ConstantItemCreator, {

    /**
     * Instantiates an Item.
     * @param {Vector2} location
     * @returns {Item}
     * @protected
     * @override
     */
    createItemProtected: function( location ) {
      return new ConstantItem( this._weight, this.debugName, this.icon, this.iconShadow, {
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
 