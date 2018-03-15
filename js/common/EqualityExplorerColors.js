// Copyright 2018, University of Colorado Boulder

/**
 * Colors used in this sim. This is not the complete set of all colors.
 * It's colors that are used in more than one place, and/or colors that required repeated tweaking.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );

  var EqualityExplorerColors = {

    // screen background colors, see https://github.com/phetsims/equality-explorer/issues/21
    BASICS_SCREEN_BACKGROUND: 'rgb( 255, 250, 227 )',
    NUMBERS_SCREEN_BACKGROUND: 'rgb( 214, 233, 254 )',
    VARIABLES_SCREEN_BACKGROUND: 'rgb( 239, 253, 218 )',
    SOLVING_SCREEN_BACKGROUND:  'rgb( 237, 225, 253 )',
    SOLVE_IT_SCREEN_BACKGROUND: 'rgb( 248, 227, 226 )'
  };

  equalityExplorer.register( 'EqualityExplorerColors', EqualityExplorerColors );

  return EqualityExplorerColors;
} );