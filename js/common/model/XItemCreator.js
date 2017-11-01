// Copyright 2017, University of Colorado Boulder

/**
 * XItemCreator creates and manages XItems (items that are associated with the variable 'x').
 *
 * @author Chris Malley (PixelZoom, Inc.)     
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemCreator = require( 'EQUALITY_EXPLORER/common/model/ItemCreator' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Util = require( 'DOT/Util' );
  var XItem = require( 'EQUALITY_EXPLORER/common/model/XItem' );

  /**
   * @param {number} weight - initial weight
   * @param {number} coefficient
   * @param {Node} icon
   * @param {Node} iconShadow
   * @param {Object} [options]
   * @constructor
   */
  function XItemCreator( weight, coefficient, icon, iconShadow, options ) {

    assert && assert( coefficient === 1 || coefficient === -1, 'invalid coefficient: ' + coefficient );
    
    var self = this;

    // @public
    this.weightProperty = new NumberProperty( weight, {
      isValidValue: function( value ) { return Util.isInteger( value ); } // integer values
    } );

    // @public (read-only)
    this.coefficient = coefficient;

    ItemCreator.call( this, icon, iconShadow, options );

    // Update the weight of all XItems. unlink not required.
    this.weightProperty.link( function( weight ) {
      var items = self.getItems();
      for ( var i = 0; i < items.length; i++ ) {
        assert && assert( items[ i ] instanceof XItem, 'unexpected item type' );
        items[ i ].weightProperty.value = weight;
      }
    } );
  }

  equalityExplorer.register( 'XItemCreator', XItemCreator );

  return inherit( ItemCreator, XItemCreator, {

    /**
     * Instantiates an XItem.
     * @param {Vector2} location
     * @returns {XItem}
     * @protected
     * @override
     */
    createItemProtected: function( location ) {
      return new XItem( this.weightProperty, this.coefficient, this.icon, this.iconShadow, {
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
 