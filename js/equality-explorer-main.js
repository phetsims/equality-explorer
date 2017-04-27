// Copyright 2017, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BasicsScreen = require( 'EQUALITY_EXPLORER/basics/BasicsScreen' );
  var NumbersScreen = require( 'EQUALITY_EXPLORER/numbers/NumbersScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var SolvingScreen = require( 'EQUALITY_EXPLORER/solving/SolvingScreen' );
  var VariablesScreen = require( 'EQUALITY_EXPLORER/variables/VariablesScreen' );

  // strings
  var equalityExplorerTitleString = require( 'string!EQUALITY_EXPLORER/equality-explorer.title' );

  var options = {
    credits: {
      //TODO fill in credits
      leadDesign: 'Amanda McGarry',
      softwareDevelopment: 'Chris Malley (PixelZoom, Inc.)',
      team: '',
      qualityAssurance: '',
      graphicArts: '',
      thanks: ''
    }
  };

  SimLauncher.launch( function() {

    var screens = [
      new BasicsScreen(),
      new NumbersScreen(),
      new VariablesScreen(),
      new SolvingScreen()
    ];

    var sim = new Sim( equalityExplorerTitleString, screens, options );
    sim.start();
  } );
} );