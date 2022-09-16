// Copyright 2018-2022, University of Colorado Boulder

// @ts-nocheck
/**
 * The 'Solve It!' screen.
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
import SolveItModel from './model/SolveItModel.js';
import SolveItScreenView from './view/SolveItScreenView.js';

class SolveItScreen extends EqualityExplorerScreen {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // EqualityExplorerScreen options
      name: EqualityExplorerStrings.screen.solveItStringProperty,
      backgroundColorProperty: new Property( EqualityExplorerColors.SOLVE_IT_SCREEN_BACKGROUND ),
      homeScreenIcon: EqualityExplorerScreenIcons.createSolveItHomeScreenIcon(),
      navigationBarIcon: EqualityExplorerScreenIcons.createSolveItNavigationBarIcon()
    }, options );

    super(
      () => new SolveItModel(),
      model => new SolveItScreenView( model ),
      options
    );
  }
}

equalityExplorer.register( 'SolveItScreen', SolveItScreen );

export default SolveItScreen;