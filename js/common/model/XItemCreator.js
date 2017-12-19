// Copyright 2017, University of Colorado Boulder

/**
 * XItemCreator creates and manages XItems (items that are associated with the variable 'x').
 *
 * @author Chris Malley (PixelZoom, Inc.)     
 */
define( function( require ) {
  'use strict';

  // modules
  var AbstractItemCreator = require( 'EQUALITY_EXPLORER/common/model/AbstractItemCreator' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var XItem = require( 'EQUALITY_EXPLORER/common/model/XItem' );

  /**
   * @param {Node} icon
   * @param {Node} shadow
   * @param {Object} [options]
   * @constructor
   */
  function XItemCreator( icon, shadow, options ) {

    var self = this;

    options = _.extend( {
      weight: 1,
      sign: 1 // determines the sign of 'x' (1 positive, -1 negative)
    }, options );

    assert && assert( options.sign === 1 || options.sign === -1,
      'invalid sign: ' + options.sign );

    // @public
    this.weightProperty = new NumberProperty( options.weight, {
      valueType: 'Integer'
    } );

    // @public (read-only)
    this.sign = options.sign;

    AbstractItemCreator.call( this, icon, shadow, options );

    // Update the weight of all XItems. unlink unnecessary
    this.weightProperty.link( function( weight ) {
      var items = self.getItems();
      for ( var i = 0; i < items.length; i++ ) {
        items[ i ].weightProperty.value = weight;
      }
    } );
  }

  equalityExplorer.register( 'XItemCreator', XItemCreator );

  return inherit( AbstractItemCreator, XItemCreator, {

    /**
     * Instantiates an XItem.
     * @param {Vector2} location
     * @returns {AbstractItem}
     * @protected
     * @override
     */
    createItemProtected: function( location ) {
      return new XItem( this.weightProperty, this.sign, this.icon, this.shadow, {
        location: location,
        dragBounds: this.dragBounds
      } );
    },

    /**
     * Gets the item's weight.
     * @returns {number}
     * @public
     * @override
     */
    get weight() {
      return this.weightProperty.value;
    }
  } );
} );
 