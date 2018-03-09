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
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );

  var EqualityExplorerConstants = {

    // ScreenView
    SCREEN_VIEW_LAYOUT_BOUNDS: new Bounds2( 0, 0, 1024, 618 ),
    SCREEN_VIEW_X_MARGIN: 20,
    SCREEN_VIEW_Y_MARGIN: 20,

    // Common to all accordion boxes
    ACCORDION_BOX_TITLE_FONT_SIZE: 18,
    BIG_TERM_INTEGER_FONT_SIZE: 40,

    // model
    VARIABLE_RANGE: new RangeWithValue( -40, 40, 1 ),
    NUMBER_OF_SNAPSHOTS: 5,
    OPERATORS: [ MathSymbols.PLUS, MathSymbols.MINUS, MathSymbols.TIMES, MathSymbols.DIVIDE ],

    // terms
    SMALL_TERM_DIAMETER: 32,
    BIG_TERM_DIAMETER: 100,
    SHADOW_OPACITY: 0.4
  };

  equalityExplorer.register( 'EqualityExplorerConstants', EqualityExplorerConstants );

  return EqualityExplorerConstants;
} );
