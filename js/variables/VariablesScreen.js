// Copyright 2017-2019, University of Colorado Boulder

/**
 * The 'Variables' screen.
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
import VariablesModel from './model/VariablesModel.js';
import VariablesScreenView from './view/VariablesScreenView.js';

const screenVariablesString = equalityExplorerStrings.screen.variables;

/**
 * @param {Object} [options]
 * @constructor
 */
function VariablesScreen( options ) {

  options = merge( {

    // EqualityExplorerScreen options
    name: screenVariablesString,
    backgroundColorProperty: new Property( EqualityExplorerColors.VARIABLES_SCREEN_BACKGROUND ),
    homeScreenIcon: EqualityExplorerScreenIcons.createVariablesScreenIcon()
  }, options );

  EqualityExplorerScreen.call( this,
    function() { return new VariablesModel(); },
    function( model ) { return new VariablesScreenView( model ); },
    options
  );
}

equalityExplorer.register( 'VariablesScreen', VariablesScreen );

inherit( EqualityExplorerScreen, VariablesScreen );
export default VariablesScreen;