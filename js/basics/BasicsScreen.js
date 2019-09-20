// Copyright 2017-2019, University of Colorado Boulder

/**
 * The 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BasicsModel = require( 'EQUALITY_EXPLORER/basics/model/BasicsModel' );
  const BasicsScreenView = require( 'EQUALITY_EXPLORER/basics/view/BasicsScreenView' );
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const EqualityExplorerColors = require( 'EQUALITY_EXPLORER/common/EqualityExplorerColors' );
  const EqualityExplorerScreen = require( 'EQUALITY_EXPLORER/common/EqualityExplorerScreen' );
  const EqualityExplorerScreenIcons = require( 'EQUALITY_EXPLORER/common/EqualityExplorerScreenIcons' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Property = require( 'AXON/Property' );

  // strings
  const screenBasicsString = require( 'string!EQUALITY_EXPLORER/screen.basics' );

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