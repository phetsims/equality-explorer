// Copyright 2017-2022, University of Colorado Boulder

/**
 * The 'Operations' screen.
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
import OperationsModel from './model/OperationsModel.js';
import OperationsScreenView from './view/OperationsScreenView.js';

type SelfOptions = EmptySelfOptions;

type OperationsScreenOptions = SelfOptions & PickRequired<EqualityExplorerScreenOptions, 'tandem'>;

export default class OperationsScreen extends EqualityExplorerScreen<OperationsModel, OperationsScreenView> {

  public constructor( providedOptions: OperationsScreenOptions ) {

    const options = optionize<OperationsScreenOptions, SelfOptions, EqualityExplorerScreenOptions>()( {

      // EqualityExplorerScreenOptions
      name: EqualityExplorerStrings.screen.operationsStringProperty,
      backgroundColorProperty: new Property( EqualityExplorerColors.SOLVING_SCREEN_BACKGROUND ),
      homeScreenIcon: EqualityExplorerScreenIcons.createOperationsScreenIcon()
    }, providedOptions );

    super(
      () => new OperationsModel( options.tandem.createTandem( 'model' ) ),
      model => new OperationsScreenView( model, options.tandem.createTandem( 'view' ) ),
      options
    );
  }
}

equalityExplorer.register( 'OperationsScreen', OperationsScreen );