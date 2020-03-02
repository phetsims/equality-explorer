// Copyright 2017-2020, University of Colorado Boulder

/**
 * The 'Operations' screen.
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
import OperationsModel from './model/OperationsModel.js';
import OperationsScreenView from './view/OperationsScreenView.js';

// strings
const screenOperationsString = equalityExplorerStrings.screen.operations;

class OperationsScreen extends EqualityExplorerScreen {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // EqualityExplorerScreen options
      name: screenOperationsString,
      backgroundColorProperty: new Property( EqualityExplorerColors.SOLVING_SCREEN_BACKGROUND ),
      homeScreenIcon: EqualityExplorerScreenIcons.createOperationsScreenIcon()
    }, options );

    super(
      () => new OperationsModel(),
      model => new OperationsScreenView( model ),
      options
    );
  }
}

equalityExplorer.register( 'OperationsScreen', OperationsScreen );

export default OperationsScreen;