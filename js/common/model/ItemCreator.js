// Copyright 2017, University of Colorado Boulder

/**
 * Creates Items with a specified value and icon.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
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
      constantTerm: false, // {boolean} do Items evaluate to a constant?
      dragBounds: Bounds2.EVERYTHING
    }, options );

    // @public (read-only)
    this.name = name;
    this.icon = icon;
    this.constantTerm = options.constantTerm;

    // @public {Bounds2} drag bounds for Items created
    this.dragBounds = options.dragBounds;

    // @public {Property.<number>} weight of each Item. All Items have the same weight.
    this.weightProperty = new Property( weight );

    // @public {ObservableArray.<Item>} all Items that currently exist
    this.items = new ObservableArray();

    // @public {ObservableArray.<Item>} Items that are on the scale, a subset of this.items
    this.itemsOnScale = new ObservableArray();

    // @public {Property.<boolean>} is this ItemCreator enabled?
    this.enabledProperty = new Property( true );

    // @private
    this.removeItemBound = this.removeItem.bind( this );
  }

  equalityExplorer.register( 'ItemCreator', ItemCreator );

  return inherit( Object, ItemCreator, {

    // @public
    reset: function() {
      this.disposeAllItems();
      this.weightProperty.reset();
    },

    /**
     * Animate Items.
     * @param {number} dt - time since the previous step, in seconds
     */
    step: function( dt ) {
      this.items.forEach( function( item ) {
         item.step( dt );
      } );
    },

    /**
     * Creates an Item.
     * @param {Object} [options] - same as Item constructor
     * @returns {Item}
     * @public
     */
    createItem: function( options ) {

      options = _.extend( {
        constantTerm: this.constantTerm,
        dragBounds: this.dragBounds
      }, options );

      var item = new Item( this.name, this.weightProperty, this.icon, options );
      this.items.add( item );

      // clean up when the item is disposed
      item.disposedEmitter.addListener( this.removeItemBound );

      return item;
    },

    /**
     * Removes an Item, called when Item.dispose is called.
     * @param {Item} item
     * @private
     */
    removeItem: function( item ) {
      assert && assert( this.items.contains( item ), 'item not found: ' + item.toString() );
      if ( this.itemsOnScale.contains( item ) ) {
        this.itemsOnScale.remove( item );
      }
      this.items.remove( item );
    },

    /**
     * Records the fact that an Item is on the scale.
     * @param {Item} item
     */
    addItemToScale: function( item ) {
      assert && assert( this.items.contains( item ), 'item not found: ' + item.toString() );
      assert && assert( !this.itemsOnScale.contains( item ), 'item already on scale: ' + item.toString() );
      this.itemsOnScale.push( item );
    },

    /**
     * Records the fact that an Item is no longer on the scale.
     * @param {Item} item
     */
    removeItemFromScale: function( item ) {
      assert && assert( this.items.contains( item ), 'item not found: ' + item.toString() );
      assert && assert( this.itemsOnScale.contains( item ), 'item not on scale: ' + item.toString() );
      this.itemsOnScale.remove( item );
    },

    /**
     * Disposes of all Items that were created by this ItemCreator.
     * @public
     */
    disposeAllItems: function() {
      this.itemsOnScale.clear();
      while ( this.items.length > 0 ) {
        var item = this.items.get( 0 );
        item.dispose();
      }
    },

    /**
     * Gets the total weight of all Items that were created by this ItemCreator.
     * @returns {number}
     * @public
     */
    get totalWeight() { return this.items.length * this.weightProperty.value; }
  } );
} );
