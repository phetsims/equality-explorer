// Copyright 2017-2022, University of Colorado Boulder

/**
 * The 'Numbers' screen.
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
import NumbersModel from './model/NumbersModel.js';
import NumbersScreenView from './view/NumbersScreenView.js';

type SelfOptions = EmptySelfOptions;

type NumbersScreenOptions = SelfOptions & PickRequired<EqualityExplorerScreenOptions, 'tandem'>;

export default class NumbersScreen extends EqualityExplorerScreen<NumbersModel, NumbersScreenView> {

  public constructor( providedOptions: NumbersScreenOptions ) {

    const options = optionize<NumbersScreenOptions, SelfOptions, EqualityExplorerScreenOptions>()( {

      // EqualityExplorerScreenOptions
      name: EqualityExplorerStrings.screen.numbersStringProperty,
      backgroundColorProperty: new Property( EqualityExplorerColors.NUMBERS_SCREEN_BACKGROUND ),
      homeScreenIcon: EqualityExplorerScreenIcons.createNumbersScreenIcon()
    }, providedOptions );

    super(
      () => new NumbersModel( options.tandem.createTandem( 'model' ) ),
      model => new NumbersScreenView( model, options.tandem.createTandem( 'view' ) ),
      options
    );
  }
}

equalityExplorer.register( 'NumbersScreen', NumbersScreen );