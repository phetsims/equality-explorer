// Copyright 2017-2020, University of Colorado Boulder

/**
 * The 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import merge from '../../../phet-core/js/merge.js';
import EqualityExplorerColors from '../common/EqualityExplorerColors.js';
import EqualityExplorerScreen from '../common/EqualityExplorerScreen.js';
import EqualityExplorerScreenIcons from '../common/EqualityExplorerScreenIcons.js';
import equalityExplorer from '../equalityExplorer.js';
import equalityExplorerStrings from '../equalityExplorerStrings.js';
import BasicsModel from './model/BasicsModel.js';
import BasicsScreenView from './view/BasicsScreenView.js';

class BasicsScreen extends EqualityExplorerScreen {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // EqualityExplorerScreen options
      name: equalityExplorerStrings.screen.basics,
      backgroundColorProperty: new Property( EqualityExplorerColors.BASICS_SCREEN_BACKGROUND ),
      homeScreenIcon: EqualityExplorerScreenIcons.createBasicsScreenIcon()
    }, options );

    super(
      () => new BasicsModel(),
      model => new BasicsScreenView( model ),
      options
    );
  }
}

equalityExplorer.register( 'BasicsScreen', BasicsScreen );

export default BasicsScreen;