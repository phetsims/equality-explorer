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
  var Fraction = require( 'PHETCOMMON/model/Fraction' );
  var MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  // constants
  var PANEL_CORNER_RADIUS = 3;

  var EqualityExplorerConstants = {

    // credits, applied to the entire family of sims:
    // equality-explorer, equality-explorer-basics and equality-explorer-two-variables
    CREDITS: {
      leadDesign: 'Amanda McGarry',
      softwareDevelopment: 'Chris Malley (PixelZoom, Inc.)',
      team: 'Diana L\u00f3pez Tavares, Ariel Paul, Kathy Perkins, Argenta Price, Beth Stade, David Webb',
      qualityAssurance: 'Steele Dalton, Ethan Johnson, Megan Lai, Andrea Lin, Liam Mulhall, Jacob Romero, Kathryn Woessner',
      graphicArts: 'Mariah Hermsmeyer, Cheryl McCutchan',
      thanks: ''
    },

    // ScreenView
    SCREEN_VIEW_LAYOUT_BOUNDS: new Bounds2( 0, 0, 1024, 618 ),
    SCREEN_VIEW_X_MARGIN: 20,
    SCREEN_VIEW_Y_MARGIN: 16,

    // terms
    DEFAULT_CONSTANT_VALUE: Fraction.fromInteger( 1 ), // constant terms are created with this value by default
    DEFAULT_COEFFICIENT: Fraction.fromInteger( 1 ), // variable terms are created with this coefficient by default
    SMALL_TERM_DIAMETER: 32, // diameter of small terms, like those in the TermsToolbox
    BIG_TERM_DIAMETER: 100, // diameter of big terms, like those on the scale in the Operations screen
    SHADOW_OPACITY: 0.4, // opacity of the shadow that appears on terms, 0-1 (transparent-opaque)

    // universal operators, in the order that they appear in the operator picker
    OPERATORS: [ MathSymbols.PLUS, MathSymbols.MINUS, MathSymbols.TIMES, MathSymbols.DIVIDE ],

    // options shared by all accordion boxes
    ACCORDION_BOX_OPTIONS: {
      resize: false,
      fill: 'white',
      titleAlignX: 'left',
      titleXSpacing: 8,
      buttonLength: 20,
      buttonXMargin: 10,
      buttonYMargin: 8,
      buttonTouchAreaXDilation: 10,
      buttonTouchAreaYDilation: 10,
      cornerRadius: PANEL_CORNER_RADIUS
    },

    // initial state of accordion boxes for all screens
    EQUATION_ACCORDION_BOX_EXPANDED: true,
    VARIABLES_ACCORDION_BOX_EXPANDED: true,
    SNAPSHOTS_ACCORDION_BOX_EXPANDED: false,

    // Fonts
    ACCORDION_BOX_TITLE_FONT: new PhetFont( 18 ),
    UNIVERSAL_OPERATION_SYMBOL_FONT: new MathSymbolFont( 24 ), // for anything that's not a number
    UNIVERSAL_OPERATION_INTEGER_FONT: new PhetFont( 24 ), // for integer numbers
    UNIVERSAL_OPERATION_FRACTION_FONT: new PhetFont( 12 ), // for fraction numerator and denominator
    SUM_TO_ZERO_BIG_FONT_SIZE: 40, // for sum-to-zero animation that involves a 'big' term on the scale
    SUM_TO_ZERO_SMALL_FONT_SIZE: 24, // for sum-to-zero animation that involves a 'small' term on the scale

    // Panels
    PANEL_CORNER_RADIUS: PANEL_CORNER_RADIUS
  };

  equalityExplorer.register( 'EqualityExplorerConstants', EqualityExplorerConstants );

  return EqualityExplorerConstants;
} );
