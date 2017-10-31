// Copyright 2017, University of Colorado Boulder

/**
 * XItem is an item associated with the variable 'x' and can be summed with other XItems.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Item = require( 'EQUALITY_EXPLORER/common/model/Item' );

  /**
   * @param {NumberProperty} weightProperty
   * @param {number} coefficient
   * @param {Node} icon
   * @param {Node} iconShadow
   * @param {Object} [options]
   * @constructor
   */
  function XItem( weightProperty, coefficient, icon, iconShadow, options ) {

    assert && assert( coefficient === 1 || coefficient === -1, 'invalid coefficient: ' + coefficient );

    // @public
    this.weightProperty = weightProperty;

    // @public (read-only) 
    this.coefficient = coefficient;

    Item.call( this, icon, iconShadow, options );
  }

  equalityExplorer.register( 'XItem', XItem );

  return inherit( Item, XItem, {

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
 