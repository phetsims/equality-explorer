// Copyright 2018-2019, University of Colorado Boulder

/**
 * The 'Solve It!' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import inherit from '../../../phet-core/js/inherit.js';
import merge from '../../../phet-core/js/merge.js';
import EqualityExplorerColors from '../common/EqualityExplorerColors.js';
import EqualityExplorerScreen from '../common/EqualityExplorerScreen.js';
import EqualityExplorerScreenIcons from '../common/EqualityExplorerScreenIcons.js';
import equalityExplorerStrings from '../equality-explorer-strings.js';
import equalityExplorer from '../equalityExplorer.js';
import SolveItModel from './model/SolveItModel.js';
import SolveItScreenView from './view/SolveItScreenView.js';

const screenSolveItString = equalityExplorerStrings.screen.solveIt;

/**
 * @param {Object} [options]
 * @constructor
 */
function SolveItScreen( options ) {

  options = merge( {

    // EqualityExplorerScreen options
    name: screenSolveItString,
    backgroundColorProperty: new Property( EqualityExplorerColors.SOLVE_IT_SCREEN_BACKGROUND ),
    homeScreenIcon: EqualityExplorerScreenIcons.createSolveItHomeScreenIcon(),
    navigationBarIcon: EqualityExplorerScreenIcons.createSolveItNavigationBarIcon()
  }, options );

  EqualityExplorerScreen.call( this,
    function() { return new SolveItModel(); },
    function( model ) { return new SolveItScreenView( model ); },
    options
  );
}

equalityExplorer.register( 'SolveItScreen', SolveItScreen );

inherit( EqualityExplorerScreen, SolveItScreen );
export default SolveItScreen;