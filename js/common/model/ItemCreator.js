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
   * @param {string} name - internal name, not displayed to the user
   * @param {number} value
   * @param {Node} icon
   * @param {Object} [options]
   * @constructor
   */
  function ItemCreator( name, value, icon, options ) {

    options = _.extend( {
      constantTerm: false // {boolean} do Items evaluate to a constant?
    }, options );

    // @public (read-only)
    this.name = name;
    this.value = value;
    this.icon = icon;
    this.constantTerm = options.constantTerm;
  }

  equalityExplorer.register( 'ItemCreator', ItemCreator );

  return inherit( Object, ItemCreator, {

    /**
     * Creates an Item.
     * @param {Object} [options] - same as Item constructor
     * @returns {Item}
     */
    createItem: function( options ) {
      options = _.extend( {
        constantTerm: this.constantTerm
      }, options );
      return new Item( this.name, this.value, this.icon, options );
    }
  } );
} );
