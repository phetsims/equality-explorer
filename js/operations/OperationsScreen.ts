// Copyright 2017-2022, University of Colorado Boulder

// @ts-nocheck
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
import equalityExplorer from '../equalityExplorer.js';
import EqualityExplorerStrings from '../EqualityExplorerStrings.js';
import OperationsModel from './model/OperationsModel.js';
import OperationsScreenView from './view/OperationsScreenView.js';

class OperationsScreen extends EqualityExplorerScreen {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // EqualityExplorerScreen options
      name: EqualityExplorerStrings.screen.operationsStringProperty,
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