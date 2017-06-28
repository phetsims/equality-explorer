// Copyright 2017, University of Colorado Boulder

/**
 * Platform where items are placed to be weighed on a balance scale.
 *
 * @author Chris Malley (PixelZoom, Inc)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {DerivedProperty} locationProperty
   * @param {Object} [options]
   * @constructor
   */
  function WeighingPlatform( locationProperty, options ) {

    options = _.extend( {
      supportHeight: 10,
      diameter: 20,
      gridSize: new Dimension2( 5, 5 ),
      cellSize: new Dimension2( 10, 10 )
    }, options );

    // @public (read-only)
    this.locationProperty = locationProperty;
    this.supportHeight = options.supportHeight;
    this.diameter = options.diameter;
    this.gridSize = options.gridSize;
    this.cellSize = options.cellSize;
  }

  equalityExplorer.register( 'WeighingPlatform', WeighingPlatform );

  return inherit( Object, WeighingPlatform );
} );
