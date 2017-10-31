// Copyright 2017, University of Colorado Boulder

/**
 * Abstract base type for creating and managing Items.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var Util = require( 'DOT/Util' );

  /**
   * @param {string} debugName - internal name, not displayed to the user
   * @param {Node} icon
   * @param {Node} iconShadow
   * @param {Object} [options]
   * @constructor
   */
  function ItemCreator( debugName, icon, iconShadow, options ) {

    options = _.extend( {
      dragBounds: Bounds2.EVERYTHING, // {Bounds2} dragging is constrained to these bounds

      //TODO this type doesn't do anything with this, move elsewhere?
      numberOfItemsOnScale: 0 // number of items initially on the scale
    }, options );

    assert && assert( ( options.numberOfItemsOnScale >= 0 ) && Util.isInteger( options.numberOfItemsOnScale ),
      'numberOfItemsOnScale is invalid: ' + options.numberOfItemsOnScale );

    // @public (read-only)
    this.debugName = debugName;
    this.icon = icon;
    this.iconShadow = iconShadow;
    this.numberOfItemsOnScale = options.numberOfItemsOnScale;

    // @public {Bounds2} drag bounds for Items created
    this.dragBounds = options.dragBounds;

    // @protected {ObservableArray.<Item>} all Items that currently exist
    this.allItems = new ObservableArray();

    // @public (read-only) so we don't need to expose allItems
    this.numberOfItemsProperty = this.allItems.lengthProperty;

    // @private {ObservableArray.<Item>} Items that are on the scale, a subset of allItems
    this.itemsOnScale = new ObservableArray();

    // @public (read-only) so we don't need to expose itemsOnScale
    this.numberOfItemsOnScaleProperty = this.itemsOnScale.lengthProperty;

    // @public is this ItemCreator enabled?
    this.enabledProperty = new BooleanProperty( true );

    // @private called when Item.dispose is called
    this.itemWasDisposedBound = this.itemWasDisposed.bind( this );
  }

  equalityExplorer.register( 'ItemCreator', ItemCreator );

  return inherit( Object, ItemCreator, {

    /**
     * Instantiates an Item.
     * @param {Vector2} location
     * @returns {Item}
     * @protected
     * @abstract
     */
    createItemProtected: function( location ) {
      throw new Error( 'createItemProtected must be implemented by subtypes' );
    },

    /**
     * Gets the Item's weight
     * @returns {number}
     * @public
     * @abstract
     */
    get weight() {
      throw new Error( 'weight getter must be implemented by subtype' );
    },

    // @public
    reset: function() {
      this.disposeAllItems();
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
     * @param {Vector2} location
     * @returns {Item}
     * @public
     */
    createItem: function( location ) {

      var item = this.createItemProtected( location );
      this.allItems.add( item );

      // Clean up when the item is disposed. Item.dispose handles removal of this listener.
      item.disposedEmitter.addListener( this.itemWasDisposedBound );

      return item;
    },

    /**
     * Gets an array of all Items managed by this ItemCreator.
     * @returns {Item[]}
     * @public
     */
    getItems: function() {
      return this.allItems.getArray().slice();
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
     * Gets the set of Items that are on the scale.
     * @returns {Item[]}
     * @public
     */
    getItemsOnScale: function() {
      return this.itemsOnScale.getArray().slice(); // defensive shallow copy
    },

    /**
     * Gets the number of Items on the scale.
     * @returns {number}
     */
    getNumberOfItemsOnScale: function() {
      return this.itemsOnScale.length;
    },

    /**
     * Disposes of all Items that were created by this ItemCreator.
     * @private
     */
    disposeAllItems: function() {
      while ( this.allItems.length > 0 ) {
        this.allItems.get( 0 ).dispose(); // results in call to itemWasDisposed
      }
    },

    /**
     * Disposes of all Items that are on the scale.
     * @public
     */
    disposeItemsOnScale: function() {
      while ( this.itemsOnScale.length > 0 ) {
        this.itemsOnScale.get( 0 ).dispose(); // results in call to itemWasDisposed
      }
    },

    /**
     * Called when Item.dispose is called.
     * @param {Item} item
     * @private
     */
    itemWasDisposed: function( item ) {
      assert && assert( this.allItems.contains( item ), 'item not found: ' + item.toString() );
      if ( this.itemsOnScale.contains( item ) ) {
        this.removeItemFromScale( item );
      }
      this.allItems.remove( item );
    }
  } );
} );
