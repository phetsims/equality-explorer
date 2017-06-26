// Copyright 2017, University of Colorado Boulder

/**
 * Platform where items are placed to be weighed on a balance scale.
 *
 * @author Chris Malley (PixelZoom, Inc)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {DerivedProperty} locationProperty
   * @param {number} diameter
   * @param {Dimension2} gridSize
   * @constructor
   */
  function WeighingPlatform( locationProperty, diameter, gridSize ) {

    // @public (read-only)
    this.locationProperty = locationProperty;
    this.diameter = diameter;
    this.gridSize = gridSize;
  }

  equalityExplorer.register( 'WeighingPlatform', WeighingPlatform );

  return inherit( Object, WeighingPlatform );
} );
