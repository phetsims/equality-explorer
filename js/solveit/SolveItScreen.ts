// Copyright 2018-2022, University of Colorado Boulder

/**
 * The 'Solve It!' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import PickRequired from '../../../phet-core/js/types/PickRequired.js';
import EqualityExplorerColors from '../common/EqualityExplorerColors.js';
import EqualityExplorerScreenIcons from '../common/EqualityExplorerScreenIcons.js';
import equalityExplorer from '../equalityExplorer.js';
import EqualityExplorerStrings from '../EqualityExplorerStrings.js';
import SolveItModel from './model/SolveItModel.js';
import SolveItScreenView from './view/SolveItScreenView.js';

type SelfOptions = EmptySelfOptions;

type SolveItScreenOptions = SelfOptions & PickRequired<ScreenOptions, 'tandem'>;

export default class SolveItScreen extends Screen<SolveItModel, SolveItScreenView> {

  public constructor( providedOptions: SolveItScreenOptions ) {

    const options = optionize<SolveItScreenOptions, SelfOptions, ScreenOptions>()( {

      // ScreenOptions
      name: EqualityExplorerStrings.screen.solveItStringProperty,
      backgroundColorProperty: new Property( EqualityExplorerColors.SOLVE_IT_SCREEN_BACKGROUND ),
      homeScreenIcon: EqualityExplorerScreenIcons.createSolveItHomeScreenIcon(),
      navigationBarIcon: EqualityExplorerScreenIcons.createSolveItNavigationBarIcon()
    }, providedOptions );

    super(
      () => new SolveItModel( options.tandem.createTandem( 'model' ) ),
      model => new SolveItScreenView( model, options.tandem.createTandem( 'view' ) ),
      options
    );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

equalityExplorer.register( 'SolveItScreen', SolveItScreen );