// Copyright 2017, University of Colorado Boulder

/**
 * ConstantItem is an item that represents a constant numeric value.
 * All ConstantItems sum to produce a constant term shown in equations.
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
   * @param {Node} icon
   * @param {Node} iconShadow
   * @param {Object} [options]
   * @constructor
   */
  function ConstantItem( weight, icon, iconShadow, options ) {

    // @private
    this._weight = weight;

    Item.call( this, icon, iconShadow, options );
  }

  equalityExplorer.register( 'ConstantItem', ConstantItem );

  return inherit( Item, ConstantItem, {

    /**
     * Gets the Item's weight.
     * @returns {number}
     */
    get weight() {
      return this._weight;
    }
  } );
} );
 