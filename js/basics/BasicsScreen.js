// Copyright 2017-2018, University of Colorado Boulder

/**
 * The 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BasicsModel = require( 'EQUALITY_EXPLORER/basics/model/BasicsModel' );
  var BasicsScreenView = require( 'EQUALITY_EXPLORER/basics/view/BasicsScreenView' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerColors = require( 'EQUALITY_EXPLORER/common/EqualityExplorerColors' );
  var EqualityExplorerScreen = require( 'EQUALITY_EXPLORER/common/EqualityExplorerScreen' );
  var EqualityExplorerScreenIcons = require( 'EQUALITY_EXPLORER/common/EqualityExplorerScreenIcons' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  // strings
  var screenBasicsString = require( 'string!EQUALITY_EXPLORER/screen.basics' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function BasicsScreen( options ) {

    options = _.extend( {

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

  return inherit( EqualityExplorerScreen, BasicsScreen );
} );