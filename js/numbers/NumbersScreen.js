// Copyright 2017-2018, University of Colorado Boulder

/**
 * The 'Numbers' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerColors = require( 'EQUALITY_EXPLORER/common/EqualityExplorerColors' );
  var EqualityExplorerScreen = require( 'EQUALITY_EXPLORER/common/EqualityExplorerScreen' );
  var EqualityExplorerScreenIcons = require( 'EQUALITY_EXPLORER/common/EqualityExplorerScreenIcons' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumbersModel = require( 'EQUALITY_EXPLORER/numbers/model/NumbersModel' );
  var NumbersScreenView = require( 'EQUALITY_EXPLORER/numbers/view/NumbersScreenView' );
  var Property = require( 'AXON/Property' );

  // strings
  var screenNumbersString = require( 'string!EQUALITY_EXPLORER/screen.numbers' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function NumbersScreen( options ) {

    options = _.extend( {
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