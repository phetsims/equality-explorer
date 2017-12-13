// Copyright 2017, University of Colorado Boulder

/**
 * Abstract base type for creating and managing items.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Emitter = require( 'AXON/Emitter' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var Property = require( 'AXON/Property' );
  var Util = require( 'DOT/Util' );

  /**
   * @param {Node} icon
   * @param {Node} iconShadow
   * @param {Object} [options]
   * @constructor
   */
  function AbstractItemCreator( icon, iconShadow, options ) {

    options = _.extend( {
      dragBounds: Bounds2.EVERYTHING, // {Bounds2} dragging is constrained to these bounds

      //TODO this type doesn't do anything with this, move elsewhere?
      numberOfItemsOnScale: 0 // number of items initially on the scale
    }, options );

    assert && assert( ( options.numberOfItemsOnScale >= 0 ) && Util.isInteger( options.numberOfItemsOnScale ),
      'numberOfItemsOnScale is invalid: ' + options.numberOfItemsOnScale );

    // @public (read-only)
    this.icon = icon;
    this.iconShadow = iconShadow;
    this.numberOfItemsOnScale = options.numberOfItemsOnScale;

    // @public {Property.<Vector2>} (read-only)
    // Initialized after the sim has loaded, since the value depends on the view. See ItemCreatorNode.
    // Should not be reset!
    this.locationProperty = new Property( null );

    // @public {Bounds2} drag bounds for items created
    this.dragBounds = options.dragBounds;

    // @protected {ObservableArray.<AbstractItem>} all items that currently exist
    this.allItems = new ObservableArray();

    // @public (read-only) so we don't need to expose allItems
    this.numberOfItemsProperty = this.allItems.lengthProperty;

    // @private {ObservableArray.<AbstractItem>} items that are on the scale, a subset of allItems
    this.itemsOnScale = new ObservableArray();

    // @public (read-only) so we don't need to expose itemsOnScale
    this.numberOfItemsOnScaleProperty = this.itemsOnScale.lengthProperty;

    //TODO remove enabledProperty if we ultimately decide not to disable item creators
    // @public is this creator enabled?
    this.enabledProperty = new BooleanProperty( true );

    // @public emit2 called when item is created, {function(AbstractItem,[Event])}
    this.itemCreatedEmitter = new Emitter();

    // @private called when AbstractItem.dispose is called
    this.itemWasDisposedBound = this.itemWasDisposed.bind( this );
  }

  equalityExplorer.register( 'AbstractItemCreator', AbstractItemCreator );

  return inherit( Object, AbstractItemCreator, {

    /**
     * Instantiates an item.
     * @param {Vector2} location
     * @returns {AbstractItem}
     * @protected
     * @abstract
     */
    createItemProtected: function( location ) {
      throw new Error( 'createItemProtected must be implemented by subtypes' );
    },

    /**
     * Gets the item's weight
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
     * Animates items.
     * @param {number} dt - time since the previous step, in seconds
     * @public
     */
    step: function( dt ) {
      this.allItems.forEach( function( item ) {
         item.step( dt );
      } );
    },

    /**
     * Creates an item.
     * @param {Event} [event] - provided if the item was created via user interaction
     * @returns {AbstractItem}
     * @public
     */
    createItem: function( event ) {

      var item = this.createItemProtected( this.locationProperty.value, event );
      this.allItems.add( item );

      // Clean up when the item is disposed. AbstractItem.dispose handles removal of this listener.
      item.disposedEmitter.addListener( this.itemWasDisposedBound );

      // Notify that an item was created
      this.itemCreatedEmitter.emit2( item, event );

      return item;
    },

    /**
     * Gets an array of all items managed.
     * @returns {Item[]}
     * @public
     */
    getItems: function() {
      return this.allItems.getArray().slice();
    },

    /**
     * Records the fact that an item is on the scale.
     * @param {AbstractItem} item
     * @public
     */
    addItemToScale: function( item ) {
      assert && assert( this.allItems.contains( item ), 'item not found: ' + item.toString() );
      assert && assert( !this.itemsOnScale.contains( item ), 'item already on scale: ' + item.toString() );
      this.itemsOnScale.push( item );
    },

    /**
     * Records the fact that an item is no longer on the scale.
     * @param {AbstractItem} item
     * @public
     */
    removeItemFromScale: function( item ) {
      assert && assert( this.allItems.contains( item ), 'item not found: ' + item.toString() );
      assert && assert( this.itemsOnScale.contains( item ), 'item not on scale: ' + item.toString() );
      this.itemsOnScale.remove( item );
    },

    /**
     * Gets the items that are on the scale.
     * @returns {Item[]}
     * @public
     */
    getItemsOnScale: function() {
      return this.itemsOnScale.getArray().slice(); // defensive shallow copy
    },

    /**
     * Gets the number of items on the scale.
     * @returns {number}
     */
    getNumberOfItemsOnScale: function() {
      return this.itemsOnScale.length;
    },

    /**
     * Disposes of all items that were created.
     * @private
     */
    disposeAllItems: function() {
      while ( this.allItems.length > 0 ) {
        this.allItems.get( 0 ).dispose(); // results in call to itemWasDisposed
      }
    },

    /**
     * Disposes of all items that are on the scale.
     * @public
     */
    disposeItemsOnScale: function() {
      while ( this.itemsOnScale.length > 0 ) {
        this.itemsOnScale.get( 0 ).dispose(); // results in call to itemWasDisposed
      }
    },

    /**
     * Called when AbstractItem.dispose is called.
     * @param {AbstractItem} item
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
