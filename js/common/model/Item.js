// Copyright 2017, University of Colorado Boulder

/**
 * An item that can be placed on the scale.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerMovable = require( 'EQUALITY_EXPLORER/common/model/EqualityExplorerMovable' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {number} value
   * @param {Object} [options]
   * @constructor
   */
  function Item( value, options ) {

    // @public (read-only)
    this.value = value;

    EqualityExplorerMovable.call( this, options );
  }

  equalityExplorer.register( 'Item', Item );

  return inherit( EqualityExplorerMovable, Item );
} );
