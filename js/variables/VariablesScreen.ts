// Copyright 2017-2022, University of Colorado Boulder

/**
 * The 'Variables' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import PickRequired from '../../../phet-core/js/types/PickRequired.js';
import EqualityExplorerColors from '../common/EqualityExplorerColors.js';
import EqualityExplorerScreen, { EqualityExplorerScreenOptions } from '../common/EqualityExplorerScreen.js';
import EqualityExplorerScreenIcons from '../common/EqualityExplorerScreenIcons.js';
import equalityExplorer from '../equalityExplorer.js';
import EqualityExplorerStrings from '../EqualityExplorerStrings.js';
import VariablesModel from './model/VariablesModel.js';
import VariablesScreenView from './view/VariablesScreenView.js';

type SelfOptions = EmptySelfOptions;

type VariablesScreenOptions = SelfOptions & PickRequired<EqualityExplorerScreenOptions, 'tandem'>;

export default class VariablesScreen extends EqualityExplorerScreen<VariablesModel, VariablesScreenView> {

  public constructor( providedOptions: VariablesScreenOptions ) {

    const options = optionize<VariablesScreenOptions, SelfOptions, EqualityExplorerScreenOptions>()( {

      // EqualityExplorerScreenOptions
      name: EqualityExplorerStrings.screen.variablesStringProperty,
      backgroundColorProperty: new Property( EqualityExplorerColors.VARIABLES_SCREEN_BACKGROUND ),
      homeScreenIcon: EqualityExplorerScreenIcons.createVariablesScreenIcon()
    }, providedOptions );

    super(
      () => new VariablesModel( options.tandem.createTandem( 'model' ) ),
      model => new VariablesScreenView( model, options.tandem.createTandem( 'view' ) ),
      options
    );
  }
}

equalityExplorer.register( 'VariablesScreen', VariablesScreen );