// Copyright 2017, University of Colorado Boulder

/**
 * Creates an Item with a specified value and icon.
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
   * @param {number} value
   * @param {Node} icon
   * @constructor
   */
  function ItemCreator( value, icon ) {

    // @public (read-only)
    this.value = value;
    this.icon = icon;
  }

  equalityExplorer.register( 'ItemCreator', ItemCreator );

  return inherit( Object, ItemCreator, {

    /**
     * Creates an Item.
     * @param {Object} [options] - same as Item constructor
     * @returns {Item}
     */
    createItem: function( options ) {
      return new Item( this.value, this.icon, options );
    }
  } );
} );
