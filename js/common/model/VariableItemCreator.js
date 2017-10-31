// Copyright 2017, University of Colorado Boulder

/**
 * VariableItemCreator creates items of type VariableItem (variables).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var VariableItem = require( 'EQUALITY_EXPLORER/common/model/VariableItem' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemCreator = require( 'EQUALITY_EXPLORER/common/model/ItemCreator' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Util = require( 'DOT/Util' );

  /**
   * @param {string} variableName - e.g. 'x'
   * @param {number} weight - initial weight
   * @param {string} debugName - internal name, not displayed to the user
   * @param {Node} icon
   * @param {Node} iconShadow
   * @param {Object} [options]
   * @constructor
   */
  function VariableItemCreator( variableName, weight, debugName, icon, iconShadow, options ) {

    var self = this;

    // @public (read-only)
    this.variableName = variableName;

    // @public
    this.weightProperty = new NumberProperty( weight, {
      isValidValue: function( value ) { return Util.isInteger( value ); } // integer values
    } );

    ItemCreator.call( this, debugName, icon, iconShadow, options );

    // Update the weight of all VariableItems. unlink not required.
    this.weightProperty.link( function( weight ) {
      var items = self.getItems();
      for ( var i = 0; i < items.length; i++ ) {
        assert && assert( items[ i ] instanceof VariableItem, 'unexpected item type' );
        items[ i ].weightProperty.value = weight;
      }
    } );
  }

  equalityExplorer.register( 'VariableItemCreator', VariableItemCreator );

  return inherit( ItemCreator, VariableItemCreator, {

    /**
     * Instantiates an Item.
     * @param {Vector2} location
     * @returns {Item}
     * @protected
     * @override
     */
    createItemProtected: function( location ) {
      return new VariableItem( this.variable, this.weightProperty, this.debugName, this.icon, this.iconShadow, {
        location: location,
        dragBounds: this.dragBounds
      } );
    },

    /**
     * Gets the Item's weight.
     * @returns {number}
     * @public
     * @override
     */
    get weight() {
      return this.weightProperty.value;
    }
  } );
} );
 