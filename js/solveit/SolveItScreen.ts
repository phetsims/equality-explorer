// Copyright 2018-2023, University of Colorado Boulder

/**
 * The 'Solve It!' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import PickRequired from '../../../phet-core/js/types/PickRequired.js';
import equalityExplorer from '../equalityExplorer.js';
import EqualityExplorerStrings from '../EqualityExplorerStrings.js';
import SolveItModel from './model/SolveItModel.js';
import SolveItScreenView from './view/SolveItScreenView.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import MathSymbols from '../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import StarNode from '../../../scenery-phet/js/StarNode.js';
import { HBox, Image, Text } from '../../../scenery/js/imports.js';
import phetGirlJugglingStars_png from '../../../vegas/images/phetGirlJugglingStars_png.js';
import EqualityExplorerColors from '../common/EqualityExplorerColors.js';

type SelfOptions = EmptySelfOptions;

type SolveItScreenOptions = SelfOptions & PickRequired<ScreenOptions, 'tandem'>;

export default class SolveItScreen extends Screen<SolveItModel, SolveItScreenView> {

  public constructor( providedOptions: SolveItScreenOptions ) {

    const options = optionize<SolveItScreenOptions, SelfOptions, ScreenOptions>()( {

      // ScreenOptions
      name: EqualityExplorerStrings.screen.solveItStringProperty,
      backgroundColorProperty: new Property( EqualityExplorerColors.SOLVE_IT_SCREEN_BACKGROUND ),
      homeScreenIcon: createHomeScreenIcon(),
      navigationBarIcon: createNavigationBarIcon(),
      isDisposable: false
    }, providedOptions );

    super(
      () => new SolveItModel( options.tandem.createTandem( 'model' ) ),
      model => new SolveItScreenView( model, options.tandem.createTandem( 'view' ) ),
      options
    );
  }
}

/**
 * Creates the home-screen icon for this screen: PhET girl juggling stars
 */
function createHomeScreenIcon(): ScreenIcon {
  const iconNode = new Image( phetGirlJugglingStars_png );
  return new ScreenIcon( iconNode, {
    fill: EqualityExplorerColors.SOLVE_IT_SCREEN_BACKGROUND
  } );
}

/**
 * Creates the navigation bar icon for this screen: +1 star
 */
function createNavigationBarIcon(): ScreenIcon {

  const numberText = new Text( `${MathSymbols.UNARY_PLUS}1`, { font: new PhetFont( 25 ) } );
  const starNode = new StarNode();

  const iconNode = new HBox( {
    spacing: 3,
    children: [ numberText, starNode ]
  } );

  return new ScreenIcon( iconNode, {
    maxIconWidthProportion: 0.75,
    fill: EqualityExplorerColors.SOLVE_IT_SCREEN_BACKGROUND
  } );
}

equalityExplorer.register( 'SolveItScreen', SolveItScreen );