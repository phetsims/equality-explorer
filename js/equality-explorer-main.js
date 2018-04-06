// Copyright 2017-2018, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BasicsScreen = require( 'EQUALITY_EXPLORER/basics/BasicsScreen' );
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var NumbersScreen = require( 'EQUALITY_EXPLORER/numbers/NumbersScreen' );
  var OperationsScreen = require( 'EQUALITY_EXPLORER/operations/OperationsScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var SolveItScreen = require( 'EQUALITY_EXPLORER/solveit/SolveItScreen' );
  var VariablesScreen = require( 'EQUALITY_EXPLORER/variables/VariablesScreen' );
  var XYScreen = require( 'EQUALITY_EXPLORER/xy/XYScreen' );

  // strings
  var equalityExplorerTitleString = require( 'string!EQUALITY_EXPLORER/equality-explorer.title' );

  var options = {
    credits: {
      //TODO fill in credits, https://github.com/phetsims/equality-explorer/issues/2
      leadDesign: 'Amanda McGarry',
      softwareDevelopment: 'Chris Malley (PixelZoom, Inc.)',
      team: 'Diana Berenice L\u00f3pez Tavares, Ariel Paul, Kathy Perkins, Argenta Price, Beth Stade, David Webb',
      qualityAssurance: '',
      graphicArts: 'Mariah Hermsmeyer, Cheryl McCutchan',
      thanks: ''
    }
  };

  SimLauncher.launch( function() {

    // production screens
    var screens = [
      new BasicsScreen(),
      new NumbersScreen(),
      new VariablesScreen(),
      new OperationsScreen(),
      new SolveItScreen()
    ];

    // non-production screen for testing multi-variable support
    if ( EqualityExplorerQueryParameters.xy ) {
      screens.push( new XYScreen() );
    }

    var sim = new Sim( equalityExplorerTitleString, screens, options );
    sim.start();
  } );
} );
