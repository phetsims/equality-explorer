// Copyright 2018, University of Colorado Boulder

/**
 * Description of a mystery object - an object whose weight is not exposed to the user.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Util = require( 'DOT/Util' );

  /**
   * @param {string} name - internal name for the mystery object type, not visible to the user
   * @param {number} weight - integer weight of 1 mystery object
   * @param {HTMLImageElement} image - image that represents the mystery object
   * @param {HTMLImageElement} shadow - shadow shown while dragging
   * @constructor
   */
  function MysteryObject( name, weight, image, shadow ) {

    assert && assert( Util.isInteger( weight ), 'weight must be an integer: ' + weight );

    // @public (read-only)
    this.name = name;
    this.weight = weight;
    this.image = image;
    this.shadow = shadow;
  }

  equalityExplorer.register( 'MysteryObject', MysteryObject );

  return inherit( Object, MysteryObject );
} );