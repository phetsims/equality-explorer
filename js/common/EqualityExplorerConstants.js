// Copyright 2017-2018, University of Colorado Boulder

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
  var RangeWithValue = require( 'DOT/RangeWithValue' );

  var EqualityExplorerConstants = {

    // ScreenView
    SCREEN_VIEW_LAYOUT_BOUNDS: new Bounds2( 0, 0, 1024, 618 ),
    SCREEN_VIEW_X_MARGIN: 20,
    SCREEN_VIEW_Y_MARGIN: 20,

    // math symbols, i18n not required
    PLUS: '\u002b',
    MINUS: '\u2212',
    TIMES: '\u00d7',
    DIVIDE: '\u00f7',
    EQUALS: '\u003d',
    GREATER_THAN: '\u003e',
    LESS_THAN: '\u003c',
    UNARY_MINUS: '\u002d',

    // Common to all accordion boxes
    ACCORDION_BOX_TITLE_FONT_SIZE: 18,

    // model
    VARIABLE_RANGE: new RangeWithValue( -40, 40, 1 ),
    NUMBER_OF_SNAPSHOTS: 5,

    // terms
    SMALL_TERM_DIAMETER: 32,
    BIG_TERM_DIAMETER: 100,
    SHADOW_OPACITY: 0.4
  };

  equalityExplorer.register( 'EqualityExplorerConstants', EqualityExplorerConstants );

  return EqualityExplorerConstants;
} );
