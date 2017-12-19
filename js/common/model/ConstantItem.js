// Copyright 2017, University of Colorado Boulder

/**
 * ConstantItem represents a constant value, and can 'sum to zero' with an inverse ConstantItem.
 * Like MysteryItems, it has a constant weight.
 * Unlike MysteryWeight, it's weight is revealed to the user, and it contributes to the constant term in equations.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MysteryItem = require( 'EQUALITY_EXPLORER/common/model/MysteryItem' );

  /**
   * @param {number} weight
   * @param {Node} icon
   * @param {Node} shadow
   * @param {Object} [options]
   * @constructor
   */
  function ConstantItem( weight, icon, shadow, options ) {

    // @public whether the item's halo is visible
    this.haloVisibleProperty = new BooleanProperty( false );

    MysteryItem.call( this, weight, icon, shadow, options );
  }

  equalityExplorer.register( 'ConstantItem', ConstantItem );

  return inherit( MysteryItem, ConstantItem );
} );
