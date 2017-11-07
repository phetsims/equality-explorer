// Copyright 2017, University of Colorado Boulder

/**
 * ConstantItem is a marker type, it includes no new functionality.
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
   * @param {Node} iconShadow
   * @param {Object} [options]
   * @constructor
   */
  function ConstantItem( weight, icon, iconShadow, options ) {

    // @public
    this.haloVisibleProperty = new BooleanProperty( false );

    MysteryItem.call( this, weight, icon, iconShadow, options );
  }

  equalityExplorer.register( 'ConstantItem', ConstantItem );

  return inherit( MysteryItem, ConstantItem );
} );
