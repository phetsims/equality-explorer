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
   * @param {Node} icon
   * @param {Node} shadow
   * @param {Object} [options]
   * @constructor
   */
  function ConstantItemCreator( icon, shadow, options ) {
    MysteryItemCreator.call( this, icon, shadow, options );
  }

  equalityExplorer.register( 'ConstantItemCreator', ConstantItemCreator );

  return inherit( MysteryItemCreator, ConstantItemCreator, {

    /**
     * Instantiates a ConstantItem.
     * @param {Vector2} location
     * @returns {AbstractItem}
     * @protected
     * @override
     */
    createItemProtected: function( location ) {
      return new ConstantItem( this._weight, this.icon, this.shadow, {
        location: location,
        dragBounds: this.dragBounds
      } );
    }
  } );
} );
 