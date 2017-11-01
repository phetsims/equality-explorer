// Copyright 2017, University of Colorado Boulder

/**
 * ConstantItemCreator creates and manages ConstantItems.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ConstantItem = require( 'EQUALITY_EXPLORER/common/model/ConstantItem' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MysteryItemCreator = require( 'EQUALITY_EXPLORER/common/model/MysteryItemCreator' );

  /**
   * @param {number} weight
   * @param {Node} icon
   * @param {Node} iconShadow
   * @param {Object} [options]
   * @constructor
   */
  function ConstantItemCreator( weight, icon, iconShadow, options ) {
    MysteryItemCreator.call( this, weight, icon, iconShadow, options );
  }

  equalityExplorer.register( 'ConstantItemCreator', ConstantItemCreator );

  return inherit( MysteryItemCreator, ConstantItemCreator, {

    /**
     * Instantiates a ConstantItem.
     * @param {Vector2} location
     * @returns {ConstantItem}
     * @protected
     * @override
     */
    createItemProtected: function( location ) {
      return new ConstantItem( this._weight, this.icon, this.iconShadow, {
        location: location,
        dragBounds: this.dragBounds
      } );
    }
  } );
} );
 