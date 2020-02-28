// Copyright 2017-2020, University of Colorado Boulder

/**
 * The 'Operations' screen.
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
import OperationsModel from './model/OperationsModel.js';
import OperationsScreenView from './view/OperationsScreenView.js';

const screenOperationsString = equalityExplorerStrings.screen.operations;

/**
 * @param {Object} [options]
 * @constructor
 */
function OperationsScreen( options ) {

  options = merge( {

    // EqualityExplorerScreen options
    name: screenOperationsString,
    backgroundColorProperty: new Property( EqualityExplorerColors.SOLVING_SCREEN_BACKGROUND ),
    homeScreenIcon: EqualityExplorerScreenIcons.createOperationsScreenIcon()
  }, options );

  EqualityExplorerScreen.call( this,
    function() { return new OperationsModel(); },
    function( model ) { return new OperationsScreenView( model ); },
    options
  );
}

equalityExplorer.register( 'OperationsScreen', OperationsScreen );

inherit( EqualityExplorerScreen, OperationsScreen );
export default OperationsScreen;