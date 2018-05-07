// Copyright 2018, University of Colorado Boulder

/**
 * Describes a type of object (sphere, apple, dog, turtle,..)
 * An object type has a variable weight that applies to all related ObjectTerms.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Range = require( 'DOT/Range' );
  var Util = require( 'DOT/Util' );

  // constants
  var DEFAULT_WEIGHT_RANGE = new Range( 1, 10 );

  /**
   * @param {string} debugName - internal name for the object type, not visible to the user
   * @param {HTMLImageElement} image - image that represents the object
   * @param {HTMLImageElement} shadow - shadow shown while dragging
   * @param {number} weight - initial integer weight of 1 object
   * @param {Object} [options]
   * @constructor
   */
  function ObjectType( debugName, image, shadow, weight, options ) {

    options = _.extend( {
      weightRange: DEFAULT_WEIGHT_RANGE
    }, options );

    assert && assert( Util.isInteger( weight ), 'weight must be an integer: ' + weight );

    // @public (read-only)
    this.debugName = debugName;
    this.image = image;
    this.shadow = shadow;
    this.weightRange = options.weightRange;

    // @public
    this.weightProperty = new NumberProperty( weight, {
      numberType: 'Integer'
    } );
  }

  equalityExplorer.register( 'ObjectType', ObjectType );

  return inherit( Object, ObjectType, {

    /**
     * @public
     */
    reset: function() {
      this.weightProperty.reset();
    }
  } );
} );