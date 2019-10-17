// Copyright 2017-2019, University of Colorado Boulder

/**
 * The 'Variables' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const EqualityExplorerColors = require( 'EQUALITY_EXPLORER/common/EqualityExplorerColors' );
  const EqualityExplorerScreen = require( 'EQUALITY_EXPLORER/common/EqualityExplorerScreen' );
  const EqualityExplorerScreenIcons = require( 'EQUALITY_EXPLORER/common/EqualityExplorerScreenIcons' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const Property = require( 'AXON/Property' );
  const VariablesModel = require( 'EQUALITY_EXPLORER/variables/model/VariablesModel' );
  const VariablesScreenView = require( 'EQUALITY_EXPLORER/variables/view/VariablesScreenView' );

  // strings
  const screenVariablesString = require( 'string!EQUALITY_EXPLORER/screen.variables' );

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

  return inherit( EqualityExplorerScreen, VariablesScreen );
} );