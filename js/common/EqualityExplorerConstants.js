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
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );

  var EqualityExplorerConstants = {

    // ScreenView
    SCREEN_VIEW_LAYOUT_BOUNDS: new Bounds2( 0, 0, 1024, 618 ),
    SCREEN_VIEW_X_MARGIN: 20,
    SCREEN_VIEW_Y_MARGIN: 20,

    // Common to all accordion boxes
    ACCORDION_BOX_TITLE_FONT: new PhetFont( 18 ),

    // Sum-to-zero animation
    SUM_TO_ZERO_BIG_FONT_SIZE: 40, // for sum-to-zero animation that involves a 'big' term on the scale
    SUM_TO_ZERO_SMALL_FONT_SIZE: 18, // for sum-to-zero animation that involves a 'small' term on the scale

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
