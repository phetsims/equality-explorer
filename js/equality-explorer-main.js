// Copyright 2017-2018, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var XYScreen = require( 'EQUALITY_EXPLORER/xy/XYScreen' );

  // strings
  var equalityExplorerTitleString = require( 'string!EQUALITY_EXPLORER/equality-explorer.title' );

  SimLauncher.launch( function() {

    var sim = new Sim( equalityExplorerTitleString, [ new XYScreen() ], {
      credits: EqualityExplorerConstants.CREDITS
    } );
    sim.start();
  } );
} );
