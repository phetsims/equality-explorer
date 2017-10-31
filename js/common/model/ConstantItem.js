// Copyright 2017, University of Colorado Boulder

/**
 * ConstantItem is an item that has a constant weight.
 * ConstantItems that are marked as being part of a 'constant term' will sum to
 * produce the constant term shown in equations (see options.constantTerm).
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

    options = _.extend( {
      constantTerm: false
    }, options );

    // @private
    this._weight = weight;

    // @public (read-only)
    this.constantTerm = options.constantTerm;

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
 