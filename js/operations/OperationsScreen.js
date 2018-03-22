// Copyright 2017, University of Colorado Boulder

/**
 * The 'Operations' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerColors = require( 'EQUALITY_EXPLORER/common/EqualityExplorerColors' );
  var EqualityExplorerScreenIcons = require( 'EQUALITY_EXPLORER/common/EqualityExplorerScreenIcons' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );
  var OperationsModel = require( 'EQUALITY_EXPLORER/operations/model/OperationsModel' );
  var OperationsScreenView = require( 'EQUALITY_EXPLORER/operations/view/OperationsScreenView' );

  // strings
  var screenOperationsString = require( 'string!EQUALITY_EXPLORER/screen.operations' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function OperationsScreen( options ) {

    options = _.extend( {
      name: screenOperationsString,
      backgroundColorProperty: new Property( EqualityExplorerColors.SOLVING_SCREEN_BACKGROUND ),
      homeScreenIcon: EqualityExplorerScreenIcons.createOperationsScreenIcon()
    }, options );

    Screen.call( this,
      function() { return new OperationsModel(); },
      function( model ) { return new OperationsScreenView( model ); },
      options
    );
  }

  equalityExplorer.register( 'OperationsScreen', OperationsScreen );

  return inherit( Screen, OperationsScreen );
} );