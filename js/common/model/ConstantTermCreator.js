// Copyright 2017, University of Colorado Boulder

/**
 * ConstantTermCreator creates and manages constant terms.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ConstantTerm = require( 'EQUALITY_EXPLORER/common/model/ConstantTerm' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MysteryTermCreator = require( 'EQUALITY_EXPLORER/common/model/MysteryTermCreator' );

  /**
   * @param {Node} icon
   * @param {Node} shadow
   * @param {Object} [options]
   * @constructor
   */
  function ConstantTermCreator( icon, shadow, options ) {
    MysteryTermCreator.call( this, icon, shadow, options );
  }

  equalityExplorer.register( 'ConstantTermCreator', ConstantTermCreator );

  return inherit( MysteryTermCreator, ConstantTermCreator, {

    /**
     * Instantiates a ConstantTerm.
     * @param {Vector2} location
     * @returns {AbstractTerm}
     * @protected
     * @override
     */
    createTermProtected: function( location ) {
      return new ConstantTerm( this._weight, this.icon, this.shadow, {
        location: location,
        dragBounds: this.dragBounds
      } );
    }
  } );
} );
 