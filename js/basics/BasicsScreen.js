// Copyright 2017-2019, University of Colorado Boulder

/**
 * The 'Basics' screen.
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
import BasicsModel from './model/BasicsModel.js';
import BasicsScreenView from './view/BasicsScreenView.js';

const screenBasicsString = equalityExplorerStrings.screen.basics;

/**
 * @param {Object} [options]
 * @constructor
 */
function BasicsScreen( options ) {

  options = merge( {

    // EqualityExplorerScreen options
    name: screenBasicsString,
    backgroundColorProperty: new Property( EqualityExplorerColors.BASICS_SCREEN_BACKGROUND ),
    homeScreenIcon: EqualityExplorerScreenIcons.createBasicsScreenIcon()
  }, options );

  EqualityExplorerScreen.call( this,
    function() { return new BasicsModel(); },
    function( model ) { return new BasicsScreenView( model ); },
    options
  );
}

equalityExplorer.register( 'BasicsScreen', BasicsScreen );

inherit( EqualityExplorerScreen, BasicsScreen );
export default BasicsScreen;