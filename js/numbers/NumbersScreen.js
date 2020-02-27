// Copyright 2017-2019, University of Colorado Boulder

/**
 * The 'Numbers' screen.
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
import NumbersModel from './model/NumbersModel.js';
import NumbersScreenView from './view/NumbersScreenView.js';

const screenNumbersString = equalityExplorerStrings.screen.numbers;

/**
 * @param {Object} [options]
 * @constructor
 */
function NumbersScreen( options ) {

  options = merge( {

    // EqualityExplorerScreen options
    name: screenNumbersString,
    backgroundColorProperty: new Property( EqualityExplorerColors.NUMBERS_SCREEN_BACKGROUND ),
    homeScreenIcon: EqualityExplorerScreenIcons.createNumbersScreenIcon()
  }, options );

  EqualityExplorerScreen.call( this,
    function() { return new NumbersModel(); },
    function( model ) { return new NumbersScreenView( model ); },
    options
  );
}

equalityExplorer.register( 'NumbersScreen', NumbersScreen );

inherit( EqualityExplorerScreen, NumbersScreen );
export default NumbersScreen;