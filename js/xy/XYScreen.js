// Copyright 2017-2018, University of Colorado Boulder

/**
 * The 'x & y' screen.
 *
 * NOTE: This screen is NOT part of the production sim. It is used to test multi-variable support.
 * The view for this screen is identical to the 'Variables' screen, but the model has 2 variables, x & y.
 * This screen is hidden behind a query parameter -- see EqualityExplorerQueryParameters.xy
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerScreen = require( 'EQUALITY_EXPLORER/common/EqualityExplorerScreen' );
  var EqualityExplorerScreenIcons = require( 'EQUALITY_EXPLORER/common/EqualityExplorerScreenIcons' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var XYModel = require( 'EQUALITY_EXPLORER/xy/model/XYModel' );
  var XYScreenView = require( 'EQUALITY_EXPLORER/xy/view/XYScreenView' );

  // strings
  var screenTwoVariabledString = 'Two Variables'; // i18n not required, this is a test string

  /**
   * @param {Object} [options]
   * @constructor
   */
  function XYScreen( options ) {

    options = _.extend( {
      name: screenTwoVariabledString,
      backgroundColorProperty: new Property( 'rgb( 214, 233, 254 )' ),
      homeScreenIcon: EqualityExplorerScreenIcons.createXYScreenIcon()
    }, options );

    EqualityExplorerScreen.call( this,
      function() { return new XYModel(); },
      function( model ) { return new XYScreenView( model ); },
      options
    );
  }

  equalityExplorer.register( 'XYScreen', XYScreen );

  return inherit( EqualityExplorerScreen, XYScreen );
} );