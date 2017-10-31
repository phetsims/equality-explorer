// Copyright 2017, University of Colorado Boulder

/**
 * TODO doc
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Item = require( 'EQUALITY_EXPLORER/common/model/Item' );

  /**
   * @param {number} weight
   * @param {string} debugName - internal name, not displayed to the user
   * @param {Node} icon
   * @param {Node} iconShadow
   * @param {Object} [options]
   * @constructor
   */
  function MysteryItem( weight, debugName, icon, iconShadow, options ) {

    // @private
    this._weight = weight;

    Item.call( this, debugName, icon, iconShadow, options );
  }

  equalityExplorer.register( 'MysteryItem', MysteryItem );

  return inherit( Item, MysteryItem, {

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
 