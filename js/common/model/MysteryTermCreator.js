// Copyright 2017, University of Colorado Boulder

/**
 * MysteryTermCreator creates and manages mystery terms.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var AbstractTermCreator = require( 'EQUALITY_EXPLORER/common/model/AbstractTermCreator' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MysteryTerm = require( 'EQUALITY_EXPLORER/common/model/MysteryTerm' );

  /**
   * @param {Node} icon
   * @param {Node} shadow
   * @param {Object} [options]
   * @constructor
   */
  function MysteryTermCreator( icon, shadow, options ) {

    options = _.extend( {
      weight: 1  // weight of each term that is created
    }, options );

    // @private
    this._weight = options.weight;

    AbstractTermCreator.call( this, icon, shadow, options );
  }

  equalityExplorer.register( 'MysteryTermCreator', MysteryTermCreator );

  return inherit( AbstractTermCreator, MysteryTermCreator, {

    /**
     * Instantiates a MysteryTerm.
     * @param {Vector2} location
     * @returns {AbstractTerm}
     * @protected
     * @override
     */
    createTermProtected: function( location ) {
      return new MysteryTerm( this._weight, this.icon, this.shadow, {
        location: location,
        dragBounds: this.dragBounds
      } );
    },

    /**
     * Gets the term's weight.
     * @returns {number}
     * @public
     * @override
     */
    get weight() {
      return this._weight;
    }
  } );
} );
 