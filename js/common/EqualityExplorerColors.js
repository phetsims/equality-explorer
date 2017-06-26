// Copyright 2017, University of Colorado Boulder

/**
 * Colors used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );

  var EqualityExplorerColors = {
    LEFT_PLATFORM_COLOR: 'rgb( 207, 60, 63 )',
    RIGHT_PLATFORM_COLOR: 'rgb( 62, 72, 158 )',
    SCALE_ARROW_BALANCED: 'rgb( 0, 200, 0 )',
    SCALE_ARROW_UNBALANCED: 'orange'
  };

  equalityExplorer.register( 'EqualityExplorerColors', EqualityExplorerColors );

  return EqualityExplorerColors;
} );
