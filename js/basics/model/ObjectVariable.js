// Copyright 2018-2019, University of Colorado Boulder

/**
 * Describes a variable associated with a type of real-world object (sphere, apple, coin, dog, ...)
 * This is a specialization of Variable (which is a symbolic variable, e.g. 'x') that carries additional
 * information related to the real-world object.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Variable = require( 'EQUALITY_EXPLORER/common/model/Variable' );

  /**
   * @param {string} symbol - symbolic name for the object type, not visible to the user
   * @param {HTMLImageElement} image - image that represents the object
   * @param {HTMLImageElement} shadow - shadow shown while dragging
   * @param {Object} [options]
   * @constructor
   */
  function ObjectVariable( symbol, image, shadow, options ) {

    // @public (read-only)
    this.image = image;
    this.shadow = shadow;

    Variable.call( this, symbol, options );
  }

  equalityExplorer.register( 'ObjectVariable', ObjectVariable );

  return inherit( Variable, ObjectVariable );
} );