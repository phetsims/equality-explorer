// Copyright 2017-2019, University of Colorado Boulder

/**
 * The 'Numbers' screen.
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
  const NumbersModel = require( 'EQUALITY_EXPLORER/numbers/model/NumbersModel' );
  const NumbersScreenView = require( 'EQUALITY_EXPLORER/numbers/view/NumbersScreenView' );
  const Property = require( 'AXON/Property' );

  // strings
  const screenNumbersString = require( 'string!EQUALITY_EXPLORER/screen.numbers' );

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

  return inherit( EqualityExplorerScreen, NumbersScreen );
} );