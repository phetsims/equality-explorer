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
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var MathSymbolFont = require( 'SCENERY_PHET/MathSymbolFont' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  var EqualityExplorerConstants = {

    //TODO fill in credits, https://github.com/phetsims/equality-explorer/issues/2
    // credits, applied to both equality-explorer and equality-explorer-basics
    CREDITS: {
      leadDesign: 'Amanda McGarry',
      softwareDevelopment: 'Chris Malley (PixelZoom, Inc.)',
      team: 'Diana Berenice L\u00f3pez Tavares, Ariel Paul, Kathy Perkins, Argenta Price, Beth Stade, David Webb',
      qualityAssurance: '',
      graphicArts: 'Mariah Hermsmeyer, Cheryl McCutchan',
      thanks: ''
    },

    // ScreenView
    SCREEN_VIEW_LAYOUT_BOUNDS: new Bounds2( 0, 0, 1024, 618 ),
    SCREEN_VIEW_X_MARGIN: 20,
    SCREEN_VIEW_Y_MARGIN: 20,

    // terms
    SMALL_TERM_DIAMETER: 32, // diameter of small terms, like those in the TermsToolbox
    BIG_TERM_DIAMETER: 100, // diameter of big terms, like those on the scale in the Operations screen
    SHADOW_OPACITY: 0.4, // opacity of the shadow that appears on terms, 0-1 (transparent-opaque)

    // universal operators, in the order that they appear in the operator picker
    OPERATORS: [ MathSymbols.PLUS, MathSymbols.MINUS, MathSymbols.TIMES, MathSymbols.DIVIDE ],

    // Fonts
    ACCORDION_BOX_TITLE_FONT: new PhetFont( 18 ),
    UNIVERSAL_OPERATION_SYMBOL_FONT: new MathSymbolFont( 24 ), // for anything that's not a number
    UNIVERSAL_OPERATION_INTEGER_FONT: new PhetFont( 24 ), // for integer numbers
    UNIVERSAL_OPERATION_FRACTION_FONT: new PhetFont( 12 ), // for fraction numerator and denominator
    SUM_TO_ZERO_BIG_FONT_SIZE: 40, // for sum-to-zero animation that involves a 'big' term on the scale
    SUM_TO_ZERO_SMALL_FONT_SIZE: 24, // for sum-to-zero animation that involves a 'small' term on the scale

    // for AccordionBoxes and Panels
    CORNER_RADIUS: 3,

    // Largest integer allowed for numerator or denominator. Anything larger results in an error dialog.
    // See https://github.com/phetsims/equality-explorer/issues/48
    LARGEST_INTEGER: EqualityExplorerQueryParameters.largestInteger,

    // reaching this score results in a reward
    GAME_REWARD_SCORE: 10
  };

  equalityExplorer.register( 'EqualityExplorerConstants', EqualityExplorerConstants );

  return EqualityExplorerConstants;
} );
