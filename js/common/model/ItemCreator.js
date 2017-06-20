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
  var ObservableArray = require( 'AXON/ObservableArray' );
  var Property = require( 'AXON/Property' );

  /**
   * @param {string} name - internal name, not displayed to the user
   * @param {number} weight - initial weight of Items
   * @param {Node} icon
   * @param {Object} [options]
   * @constructor
   */
  function ItemCreator( name, weight, icon, options ) {

    options = _.extend( {
      constantTerm: false // {boolean} do Items evaluate to a constant?
    }, options );

    // @public (read-only)
    this.name = name;
    this.icon = icon;
    this.constantTerm = options.constantTerm;

    // @public {Property.<number>} weight of Items
    this.weightProperty = new Property( weight );

    // @public {ObservableArray.<Item>}
    this.items = new ObservableArray();
  }

  equalityExplorer.register( 'ItemCreator', ItemCreator );

  return inherit( Object, ItemCreator, {

    // @public
    reset: function() {
      this.weightProperty.reset();
    },

    /**
     * Creates an Item.
     * @param {Object} [options] - same as Item constructor
     * @returns {Item}
     */
    createItem: function( options ) {
      options = _.extend( {
        constantTerm: this.constantTerm
      }, options );
      var item = new Item( this.name, this.weightProperty, this.icon, options );
      this.items.add( item );
      return item;
    },

    /**
     * Gets the total weight of all items.
     * @returns {number}
     */
    get total() { return this.items.length * this.weightProperty.value; }
  } );
} );
