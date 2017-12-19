// Copyright 2017, University of Colorado Boulder

/**
 * MysteryItem is an item that has a constant weight, but that weight is not revealed to the user.
 * MysteryItems to not contribute to the constant term in an equation.  They are represented as
 * a coefficient and an icon.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var AbstractItem = require( 'EQUALITY_EXPLORER/common/model/AbstractItem' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {number} weight
   * @param {Node} icon
   * @param {Node} shadow
   * @param {Object} [options]
   * @constructor
   */
  function MysteryItem( weight, icon, shadow, options ) {

    // @private
    this._weight = weight;

    AbstractItem.call( this, icon, shadow, options );
  }

  equalityExplorer.register( 'MysteryItem', MysteryItem );

  return inherit( AbstractItem, MysteryItem, {

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
 