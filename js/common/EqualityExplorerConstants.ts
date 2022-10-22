// Copyright 2017-2022, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../../dot/js/Range.js';
import { CreditsData } from '../../../joist/js/CreditsNode.js';
import ScreenView from '../../../joist/js/ScreenView.js';
import Fraction from '../../../phetcommon/js/model/Fraction.js';
import MathSymbolFont from '../../../scenery-phet/js/MathSymbolFont.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import { AccordionBoxOptions } from '../../../sun/js/AccordionBox.js';
import equalityExplorer from '../equalityExplorer.js';

const PANEL_CORNER_RADIUS = 3;

// options shared by all accordion boxes
const ACCORDION_BOX_OPTIONS: AccordionBoxOptions = {
  resize: false,
  fill: 'white',
  titleAlignX: 'left',
  titleXSpacing: 8,
  buttonXMargin: 10,
  buttonYMargin: 8,
  cornerRadius: PANEL_CORNER_RADIUS,
  expandCollapseButtonOptions: {
    sideLength: 20,
    touchAreaXDilation: 10,
    touchAreaYDilation: 10
  }
};

// Credits are applied to the entire family of sims:
// equality-explorer, equality-explorer-basics and equality-explorer-two-variables
const CREDITS: CreditsData = {
  leadDesign: 'Amanda McGarry',
  softwareDevelopment: 'Chris Malley (PixelZoom, Inc.)',
  team: 'Diana L\u00f3pez Tavares, Ariel Paul, Kathy Perkins, Argenta Price, Beth Stade, David Webb',
  qualityAssurance: 'Steele Dalton, Ethan Johnson, Megan Lai, Andrea Lin, Emily Miller, Liam Mulhall, Jacob Romero, Nancy Salpepi, Kathryn Woessner',
  graphicArts: 'Mariah Hermsmeyer, Cheryl McCutchan',
  thanks: ''
};

const EqualityExplorerConstants = {

  CREDITS: CREDITS,

  // ScreenView
  SCREEN_VIEW_X_MARGIN: 20,
  SCREEN_VIEW_Y_MARGIN: 16,
  SCREEN_VIEW_LAYOUT_BOUNDS: ScreenView.DEFAULT_LAYOUT_BOUNDS,

  // Workaround for things shifting around that aren't supposed to move
  // See https://github.com/phetsims/scenery/issues/1289 and https://github.com/phetsims/equality-explorer/issues/174
  SCREEN_VIEW_PREVENT_FIT: true,

  // Solve It! game
  NUMBER_OF_GAME_LEVELS: 5,

  // terms
  DEFAULT_CONSTANT_VALUE: Fraction.fromInteger( 1 ), // constant terms are created with this value by default
  DEFAULT_COEFFICIENT: Fraction.fromInteger( 1 ), // variable terms are created with this coefficient by default
  SMALL_TERM_DIAMETER: 32, // diameter of small terms, like those in the TermsToolboxNode
  BIG_TERM_DIAMETER: 100, // diameter of big terms, like those on the scale in the Operations screen
  SHADOW_OPACITY: 0.4, // opacity of the shadow that appears on terms, 0-1 (transparent-opaque)

  // ranges
  VARIABLE_RANGE: new Range( -40, 40 ), // when x, y are user-controlled
  OPERAND_RANGE: new Range( -10, 10 ),

  ACCORDION_BOX_OPTIONS: ACCORDION_BOX_OPTIONS,

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

export default EqualityExplorerConstants;