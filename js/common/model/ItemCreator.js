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

    var self = this;

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

    // @public (read-only) {ObservableArray.<Item>} all Items that currently exist
    this.allItems = new ObservableArray();

    // @public (read-only) {ObservableArray.<Item>} Items that are on the scale, a subset of allItems
    this.itemsOnScale = new ObservableArray();

    // @public {Property.<boolean>} is this ItemCreator enabled?
    this.enabledProperty = new Property( true );

    // @private {function( Item )} called when Item.dispose is called
    this.itemWasDisposedBound = function( item ) {
      assert && assert( self.allItems.contains( item ), 'item not found: ' + item.toString() );
      if ( self.itemsOnScale.contains( item ) ) {
        self.itemsOnScale.remove( item );
      }
      self.allItems.remove( item );
    };
  }

  equalityExplorer.register( 'ItemCreator', ItemCreator );

  return inherit( Object, ItemCreator, {

    // @public
    reset: function() {
      this.disposeAllItems();
      this.weightProperty.reset();
    },

    /**
     * Animates Items.
     * @param {number} dt - time since the previous step, in seconds
     * @public
     */
    step: function( dt ) {
      this.allItems.forEach( function( item ) {
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
      this.allItems.add( item );

      // clean up when the item is disposed
      item.disposedEmitter.addListener( this.itemWasDisposedBound );

      return item;
    },

    /**
     * Records the fact that an Item is on the scale.
     * @param {Item} item
     * @public
     */
    addItemToScale: function( item ) {
      assert && assert( this.allItems.contains( item ), 'item not found: ' + item.toString() );
      assert && assert( !this.itemsOnScale.contains( item ), 'item already on scale: ' + item.toString() );
      this.itemsOnScale.push( item );
    },

    /**
     * Records the fact that an Item is no longer on the scale.
     * @param {Item} item
     * @public
     */
    removeItemFromScale: function( item ) {
      assert && assert( this.allItems.contains( item ), 'item not found: ' + item.toString() );
      assert && assert( this.itemsOnScale.contains( item ), 'item not on scale: ' + item.toString() );
      this.itemsOnScale.remove( item );
    },

    /**
     * Disposes of all Items that were created by this ItemCreator.
     * @private
     */
    disposeAllItems: function() {
      this.itemsOnScale.clear();
      while ( this.allItems.length > 0 ) {
        var item = this.allItems.get( 0 );
        item.dispose();
      }
    }
  } );
} );
