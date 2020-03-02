// Copyright 2017-2020, University of Colorado Boulder

/**
 * The 'Numbers' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import merge from '../../../phet-core/js/merge.js';
import EqualityExplorerColors from '../common/EqualityExplorerColors.js';
import EqualityExplorerScreen from '../common/EqualityExplorerScreen.js';
import EqualityExplorerScreenIcons from '../common/EqualityExplorerScreenIcons.js';
import equalityExplorerStrings from '../equality-explorer-strings.js';
import equalityExplorer from '../equalityExplorer.js';
import NumbersModel from './model/NumbersModel.js';
import NumbersScreenView from './view/NumbersScreenView.js';

// strings
const screenNumbersString = equalityExplorerStrings.screen.numbers;

class NumbersScreen extends EqualityExplorerScreen {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // EqualityExplorerScreen options
      name: screenNumbersString,
      backgroundColorProperty: new Property( EqualityExplorerColors.NUMBERS_SCREEN_BACKGROUND ),
      homeScreenIcon: EqualityExplorerScreenIcons.createNumbersScreenIcon()
    }, options );

    super(
      () => new NumbersModel(),
      model => new NumbersScreenView( model ),
      options
    );
  }
}

equalityExplorer.register( 'NumbersScreen', NumbersScreen );

export default NumbersScreen;