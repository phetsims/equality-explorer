// Copyright 2017-2018, University of Colorado Boulder

/**
 * The 'Operations' screen.
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
  const OperationsModel = require( 'EQUALITY_EXPLORER/operations/model/OperationsModel' );
  const OperationsScreenView = require( 'EQUALITY_EXPLORER/operations/view/OperationsScreenView' );
  const Property = require( 'AXON/Property' );

  // strings
  const screenOperationsString = require( 'string!EQUALITY_EXPLORER/screen.operations' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function OperationsScreen( options ) {

    options = _.extend( {

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

  return inherit( EqualityExplorerScreen, OperationsScreen );
} );