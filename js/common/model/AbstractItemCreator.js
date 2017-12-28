// Copyright 2017, University of Colorado Boulder

/**
 * Abstract base type for creating and managing items.
 * Items are created either by dragging then out of panels below the scale, or by restoring a snapshot.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var Emitter = require( 'AXON/Emitter' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var Property = require( 'AXON/Property' );
  var Util = require( 'DOT/Util' );

  /**
   * @param {Node} icon - the icon used to represent the item
   * @param {Node} shadow - the shadow displayed behind the icon when the item is being dragged
   * @param {Object} [options]
   * @constructor
   */
  function AbstractItemCreator( icon, shadow, options ) {

    options = _.extend( {
      dragBounds: Bounds2.EVERYTHING, // {Bounds2} dragging is constrained to these bounds
      initialNumberOfItemsOnScale: 0 // number of items initially on the scale
    }, options );

    assert && assert( ( options.initialNumberOfItemsOnScale >= 0 ) && Util.isInteger( options.initialNumberOfItemsOnScale ),
      'initialNumberOfItemsOnScale is invalid: ' + options.initialNumberOfItemsOnScale );

    // @public (read-only)
    this.icon = icon;
    this.shadow = shadow;

    // @public {Property.<Vector2>} (read-only)
    // Location is dependent on the view and is unknowable until the sim has loaded.
    // See initialize. Do not reset!
    this.locationProperty = new Property( null );

    // @private Number of items to put on the scale initially.
    // Items cannot be put on the scale until locationProperty is initialized.
    this.initialNumberOfItemsOnScale = options.initialNumberOfItemsOnScale;

    // @public {Plate} the plate that this item creator is associated with.
    // This association necessarily occurs after instantiation.
    this.plate = null;

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

    // @public {BooleanProperty|null} optional Property that indicates whether the item creator is locked.
    // Initialized by client after instantiation, if the item creator is lockable.
    // Resetting this is the responsibility of the client.
    this.lockedProperty = null;

    // @public emit2 is called when an item is created.
    // Callback signature is function( {AbstractItem} item, {Event} [event] )
    this.itemCreatedEmitter = new Emitter();

    // @public {AbstractItemCreator|null} optional equivalent item creator on the opposite side of the scale.
    // This is needed for the lock feature, so that an equivalent item on the opposite side can be created.
    // Example: When locked, if I drag -x out of the left panel, -x needs to also drag out of the right panel.
    this.equivalentItemCreator = null;

    // @public {AbstractItemCreator} optional inverse item creator on the opposite side of the scale.
    // This is needed for lock feature, for the case where an inverse item must be created.
    // Example: When locked, if I remove x from the left plate, and the right plate is empty, then x needs
    // to be created and dragged on the right side (by equivalentItemCreator) and -x needs to be created on
    // the right plate (by inverseItemCreator).
    this.inverseItemCreator = null;

    // @private called when AbstractItem.dispose is called
    this.itemWasDisposedBound = this.itemWasDisposed.bind( this );

    // @private has this instance been fully initialized?
    this.isInitialized = false;
  }

  equalityExplorer.register( 'AbstractItemCreator', AbstractItemCreator );

  return inherit( Object, AbstractItemCreator, {

    /**
     * Completes initialization. This model element's location is dependent on the location of
     * its associated view element (ItemCreatorNode).  So initialization cannot be completed
     * until the sim has fully loaded. See frameStartedCallback in ItemCreatorNode.
     * @param {Vector2} location
     * @public
     */
    initialize: function( location ) {

      assert && assert( !this.isInitialized, 'initialize has already been called' );
      this.isInitialized = true;

      // initialize location
      this.locationProperty.value = location;

      // populate the scale, see https://github.com/phetsims/equality-explorer/issues/8
      assert && assert( this.plate, 'plate has not been initialized' );
      for ( var i = 0; i < this.initialNumberOfItemsOnScale; i++ ) {
        var cellIndex = this.plate.getFirstEmptyCell();
        assert && assert( cellIndex !== -1, 'oops, plate is full' );
        this.createItemOnScale( cellIndex );
      }
    },

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

    /**
     * Animates items.
     * @param {number} dt - time since the previous step, in seconds
     * @public
     */
    step: function( dt ) {
      for ( var i = 0; i < this.allItems.length; i++ ) {
        this.allItems.get( i ).step( dt );
      }
    },

    /**
     * Creates an item that will immediately be involved in a drag cycle.
     * @param {Event} event
     * @returns {AbstractItem}
     * @public
     */
    createItemDragging: function( event ) {
      return this.createItemPrivate( event, null /* cellIndex */ );
    },

    /**
     * Creates an item and puts it in a specified cell in the associate plate's 2D grid.
     * @param {number} cellIndex
     * @returns {AbstractItem}
     * @public
     */
    createItemOnScale: function( cellIndex ) {
      return this.createItemPrivate( null /* event */, cellIndex );
    },

    /**
     * Consolidates code that is common to createItemDragging and createItemOnScale.
     * Parameters are mutually exclusive!
     * @param {Event|null} event - the event for an item to be created via user interaction
     * @param {number|null} cellIndex - the cell of an item to be created on the scale
     * @returns {AbstractItem}
     * @private
     */
    createItemPrivate: function( event, cellIndex ) {

      assert && assert( event !== undefined && cellIndex !== undefined, 'undefined args not allowed' );
      assert && assert( event || cellIndex !== null, 'event or cellIndex must be provided' );
      assert && assert( !( event && cellIndex !== null ), 'event and cellIndex are mutually exclusive' );

      // create item
      var item = this.createItemProtected( this.locationProperty.value );
      this.allItems.add( item );

      // put item on the scale
      if ( cellIndex !== null ) {
        this.putItemOnScale( item, cellIndex );
      }

      // Clean up when the item is disposed. AbstractItem.dispose handles removal of this listener.
      item.disposedEmitter.addListener( this.itemWasDisposedBound );

      // Notify that an item was created
      this.itemCreatedEmitter.emit2( item, event );

      return item;
    },

    /**
     * Gets an array of all items managed.
     * @returns {AbstractItem[]}
     * @public
     */
    getItems: function() {
      return this.allItems.getArray().slice(); // defensive copy
    },

    /**
     * Puts an item on the scale, in a specified cell in the associated plate's 2D grid.
     * @param {AbstractItem} item
     * @param {number} cellIndex
     * @public
     */
    putItemOnScale: function( item, cellIndex ) {
      assert && assert( this.allItems.contains( item ), 'item not found: ' + item.toString() );
      assert && assert( !this.itemsOnScale.contains( item ), 'item already on scale: ' + item.toString() );
      this.itemsOnScale.push( item );
      this.plate.addItem( item, cellIndex );
    },

    /**
     * Removes an item from the scale.
     * @param {AbstractItem} item
     * @public
     */
    removeItemFromScale: function( item ) {
      assert && assert( this.allItems.contains( item ), 'item not found: ' + item.toString() );
      assert && assert( this.itemsOnScale.contains( item ), 'item not on scale: ' + item.toString() );
      this.plate.removeItem( item );
      this.itemsOnScale.remove( item );
    },

    /**
     * Is the specified item on the scale?
     * @param {AbstractItem} item
     * @returns {boolean}
     * @public
     */
    isItemOnScale: function( item ) {
      return this.itemsOnScale.contains( item );
    },

    /**
     * Gets the items that are on the scale.
     * @returns {AbstractItem[]}
     * @public
     */
    getItemsOnScale: function() {
      return this.itemsOnScale.getArray().slice(); // defensive copy
    },

    /**
     * Gets the number of items on the scale.
     * @returns {number}
     * @public
     */
    getNumberOfItemsOnScale: function() {
      return this.itemsOnScale.length;
    },

    /**
     * Disposes of all items.
     * @public
     */
    disposeAllItems: function() {

      // use a while loop because disposing of an item modifies this.allItems
      while ( this.allItems.length > 0 ) {
        this.allItems.get( 0 ).dispose(); // results in call to itemWasDisposed
      }
    },

    /**
     * Disposes of all items that are on the scale.
     * @public
     */
    disposeItemsOnScale: function() {

      // use a while loop because disposing of an item modifies this.itemsOnScale
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
      if ( this.isItemOnScale( item ) ) {
        this.removeItemFromScale( item );
      }
      this.allItems.remove( item );
    },

    /**
     * Is this item creator equivalent to a specified item creator?
     * Two item creators are equivalent if they have identical types, and their weights are the same.
     * @param {AbstractItemCreator} itemCreator
     * @returns {boolean}
     * @public
     */
    isEquivalentTo: function( itemCreator ) {
      return ( this.constructor === itemCreator.constructor ) && ( this.weight === itemCreator.weight );
    },

    /**
     * Is this item creator the inverse of a specified item creator?
     * Two item creators are inverses if they have identical types, and their weights sum to zero.
     * @param {AbstractItemCreator} itemCreator
     * @returns {boolean}
     * @public
     */
    isInverseOf: function( itemCreator ) {
      return ( this.constructor === itemCreator.constructor ) && ( this.weight + itemCreator.weight === 0 );
    }
  } );
} );
