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
    LEFT_PLATE_COLOR: 'rgb( 207, 60, 63 )',
    RIGHT_PLATE_COLOR: 'rgb( 62, 72, 158 )',
    POSITIVE_ONE_FILL: 'rgb( 246, 228, 213 )',
    NEGATIVE_ONE_FILL: 'rgb( 248, 238, 229 )',
    POSITIVE_X_FILL: 'rgb( 49, 193, 238 )',
    NEGATIVE_X_FILL: 'rgb( 99, 212, 238 )'
  };

  equalityExplorer.register( 'EqualityExplorerColors', EqualityExplorerColors );

  return EqualityExplorerColors;
} );
