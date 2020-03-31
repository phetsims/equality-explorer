// Copyright 2017-2020, University of Colorado Boulder

/**
 * The 'Variables' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import merge from '../../../phet-core/js/merge.js';
import EqualityExplorerColors from '../common/EqualityExplorerColors.js';
import EqualityExplorerScreen from '../common/EqualityExplorerScreen.js';
import EqualityExplorerScreenIcons from '../common/EqualityExplorerScreenIcons.js';
import equalityExplorerStrings from '../equalityExplorerStrings.js';
import equalityExplorer from '../equalityExplorer.js';
import VariablesModel from './model/VariablesModel.js';
import VariablesScreenView from './view/VariablesScreenView.js';

// strings
const screenVariablesString = equalityExplorerStrings.screen.variables;

class VariablesScreen extends EqualityExplorerScreen {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // EqualityExplorerScreen options
      name: screenVariablesString,
      backgroundColorProperty: new Property( EqualityExplorerColors.VARIABLES_SCREEN_BACKGROUND ),
      homeScreenIcon: EqualityExplorerScreenIcons.createVariablesScreenIcon()
    }, options );

    super(
      () => new VariablesModel(),
      model => new VariablesScreenView( model ),
      options
    );
  }
}

equalityExplorer.register( 'VariablesScreen', VariablesScreen );

export default VariablesScreen;