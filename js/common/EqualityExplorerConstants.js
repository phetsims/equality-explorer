// Copyright 2017, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );

  var EqualityExplorerConstants = {

    SCREEN_VIEW_LAYOUT_BOUNDS: new Bounds2( 0, 0, 1024, 618 ),

    SCREEN_VIEW_X_MARGIN: 20,
    SCREEN_VIEW_Y_MARGIN: 20,

    PLUS: '\u002b',
    MINUS: '\u2212',
    TIMES: '\u00d7',
    DIVIDE: '\u00f7',

    ITEM_HEIGHT: 32,

    // Height of the scale's fulcrum, on which the balance beam sits.
    FULCRUM_HEIGHT: 40,

    // Height of the vertical support that connects a plate to the balance beam
    PLATE_SUPPORT_HEIGHT: 50,

    // maximum rotation angle of the scale, in radians
    MAX_SCALE_ANGLE: Math.PI / 15
  };

  equalityExplorer.register( 'EqualityExplorerConstants', EqualityExplorerConstants );

  return EqualityExplorerConstants;
} );
