// Copyright 2018, University of Colorado Boulder

/**
 * Colors used in this sim. This is not the complete set of all colors.
 * It's colors that are used in more than one place, and/or colors that required repeated tweaking.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );

  var EqualityExplorerColors = {

    // screen background colors, see https://github.com/phetsims/equality-explorer/issues/21
    BASICS_SCREEN_BACKGROUND: 'rgb( 255, 250, 227 )',
    NUMBERS_SCREEN_BACKGROUND: 'rgb( 214, 233, 254 )',
    VARIABLES_SCREEN_BACKGROUND: 'rgb( 239, 253, 218 )',
    SOLVING_SCREEN_BACKGROUND: 'rgb( 237, 225, 253 )',
    SOLVE_IT_SCREEN_BACKGROUND: 'rgb( 248, 227, 226 )',

    // snapshots
    SNAPSHOT_SELECTED_STROKE: 'rgb( 85, 169, 223 )',
    SNAPSHOT_DESELECTED_STROKE: 'transparent', // see https://github.com/phetsims/equality-explorer/issues/112

    // terms
    POSITIVE_CONSTANT_FILL: 'rgb( 246, 228, 213 )', // beige
    NEGATIVE_CONSTANT_FILL: 'rgb( 248, 238, 229 )', // lighter beige
    POSITIVE_X_FILL: 'rgb( 49, 193, 238 )', // blue
    NEGATIVE_X_FILL: 'rgb( 99, 212, 238 )', // lighter blue
    POSITIVE_Y_FILL: 'rgb( 250, 100, 255 )', // pink
    NEGATIVE_Y_FILL: 'rgb( 240, 140, 255 )', // lighter pink

    // halo that appears when a dragged term overlaps a like term on the scale
    HALO: 'rgba( 255, 255, 0, 0.85 )', // slightly transparent yellow

    // scale and its components
    SCALE_ARROW_BALANCED: 'rgb( 0, 200, 0 )',
    SCALE_ARROW_UNBALANCED: 'black',
    SCALE_ARROW_BOTTOMED_OUT: 'red',
    SCALE_FRONT_FACE_FILL: 'rgb( 100, 100, 100 )',
    SCALE_TOP_FACE_FILL: 'rgb( 177, 177, 177 )',
    SCALE_FULCRUM_FILL: 'rgb( 204, 204, 204 )',
    PLATE_SUPPORT_FILL: 'rgb( 204, 204, 204 )',
    PLATE_OUTSIDE_FILL: '#666666',
    PLATE_INSIDE_FILL: '#B1B1B1',
    PLATE_SURFACE_FILL: '#E4E4E4',
    GRID_STROKE: 'rgb( 160, 160, 160 )'
  };

  equalityExplorer.register( 'EqualityExplorerColors', EqualityExplorerColors );

  return EqualityExplorerColors;
} );