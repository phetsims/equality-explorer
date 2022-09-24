// Copyright 2017-2022, University of Colorado Boulder

/**
 * The 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import PickRequired from '../../../phet-core/js/types/PickRequired.js';
import EqualityExplorerScreen, { EqualityExplorerScreenOptions } from '../common/EqualityExplorerScreen.js';
import equalityExplorer from '../equalityExplorer.js';
import EqualityExplorerStrings from '../EqualityExplorerStrings.js';
import BasicsModel from './model/BasicsModel.js';
import BasicsScreenView from './view/BasicsScreenView.js';
import appleBig_png from '../../images/appleBig_png.js';
import orangeBig_png from '../../images/orangeBig_png.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import MathSymbols from '../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import { HBox, Image, Text, VBox } from '../../../scenery/js/imports.js';
import EqualityExplorerColors from '../common/EqualityExplorerColors.js';

type SelfOptions = EmptySelfOptions;

type BasicsScreenOptions = SelfOptions & PickRequired<EqualityExplorerScreenOptions, 'tandem'>;

export default class BasicsScreen extends EqualityExplorerScreen<BasicsModel, BasicsScreenView> {

  public constructor( providedOptions: BasicsScreenOptions ) {

    const options = optionize<BasicsScreenOptions, SelfOptions, EqualityExplorerScreenOptions>()( {

      // EqualityExplorerScreenOptions
      name: EqualityExplorerStrings.screen.basicsStringProperty,
      backgroundColorProperty: new Property( EqualityExplorerColors.BASICS_SCREEN_BACKGROUND ),
      homeScreenIcon: createScreenIcon()
    }, providedOptions );

    super(
      () => new BasicsModel( options.tandem.createTandem( 'model' ) ),
      model => new BasicsScreenView( model, options.tandem.createTandem( 'view' ) ),
      options
    );
  }
}

/**
 * Creates the icon for this screen: apples > oranges
 */
function createScreenIcon(): ScreenIcon {

  // apples on left side of the equation
  const appleNode1 = new Image( appleBig_png );
  const appleNode2 = new Image( appleBig_png, {
    left: appleNode1.left - 10,
    top: appleNode1.bottom + 5
  } );
  const appleGroupNode = new VBox( {
    spacing: 2,
    children: [ appleNode1, appleNode2 ]
  } );

  // >
  const greaterThanText = new Text( MathSymbols.GREATER_THAN, {
    font: new PhetFont( 140 )
  } );

  // an orange on right side of the equation
  const orangeNode = new Image( orangeBig_png );

  const iconNode = new HBox( {
    spacing: 15,
    children: [ appleGroupNode, greaterThanText, orangeNode ]
  } );

  return new ScreenIcon( iconNode, {
    maxIconHeightProportion: 0.8,
    fill: EqualityExplorerColors.BASICS_SCREEN_BACKGROUND
  } );
}

equalityExplorer.register( 'BasicsScreen', BasicsScreen );