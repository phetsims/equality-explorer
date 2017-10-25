// Copyright 2017, University of Colorado Boulder

/**
 * Creates and manages Items.
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
  var Item = require( 'EQUALITY_EXPLORER/common/model/Item' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var Util = require( 'DOT/Util' );

  /**
   * @param {string} name - internal name, not displayed to the user
   * @param {number} weight - initial weight of Items
   * @param {Node} icon
   * @param {Node} iconShadow
   * @param {Object} [options]
   * @constructor
   */
  function ItemCreator( name, weight, icon, iconShadow, options ) {

    options = _.extend( {
      constantTerm: false, // {boolean} do Items evaluate to a constant?
      variableTerm: false, // {boolean} do Items represent a variable?
      dragBounds: Bounds2.EVERYTHING, // {Bounds2} dragging is constrained to these bounds
      numberOfItemsOnScale: 0 // number of items initially on the scale
    }, options );

    assert && assert( !( options.contantTerm && options.variableTerm ),
      'cannot be both a constant and a variable' );
    assert && assert( ( options.numberOfItemsOnScale >= 0 ) && Util.isInteger( options.numberOfItemsOnScale ),
      'numberOfItemsOnScale is invalid: ' + options.numberOfItemsOnScale );

    // @public (read-only)
    this.name = name;
    this.icon = icon;
    this.iconShadow = iconShadow;
    this.constantTerm = options.constantTerm;
    this.variableTerm = options.variableTerm;
    this.numberOfItemsOnScale = options.numberOfItemsOnScale;

    // @public {Bounds2} drag bounds for Items created
    this.dragBounds = options.dragBounds;

    // @public weight of each Item. All Items have the same weight.
    this.itemWeightProperty = new NumberProperty( weight, {
      isValidValue: function( value ) { return Util.isInteger( value ); } // integer values
    } );

    // @private {ObservableArray.<Item>} all Items that currently exist
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

    // @public
    reset: function() {
      this.disposeAllItems();
      this.itemWeightProperty.reset();
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

      var item = new Item( this.name, this.itemWeightProperty, this.icon, this.iconShadow, {
        location: location,
        constantTerm: this.constantTerm,
        variableTerm: this.variableTerm,
        dragBounds: this.dragBounds
      } );
      this.allItems.add( item );

      // Clean up when the item is disposed. Item.dispose handles removal of this listener.
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
