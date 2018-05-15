// Copyright 2018, University of Colorado Boulder

/**
 * Describes a variable associated with a type of real-world object (sphere, apple, dog, turtle,..)
 * This is a specialization of Variable (which is a symbolic variable, e.g. 'x') that carries additional
 * information related to the real-world object.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Range = require( 'DOT/Range' );
  var Variable = require( 'EQUALITY_EXPLORER/common/model/Variable' );

  // constants
  var DEFAULT_RANGE = new Range( 1, 10 );

  /**
   * @param {string} symbol - symbolic name for the object type, not visible to the user
   * @param {HTMLImageElement} image - image that represents the object
   * @param {HTMLImageElement} shadow - shadow shown while dragging
   * @param {Object} [options]
   * @constructor
   */
  function ObjectVariable( symbol, image, shadow, options ) {

    options = _.extend( {
      range: DEFAULT_RANGE
    }, options );

    // @public (read-only)
    this.image = image;
    this.shadow = shadow;

    Variable.call( this, symbol, options );
  }

  equalityExplorer.register( 'ObjectVariable', ObjectVariable );

  return inherit( Variable, ObjectVariable );
} );