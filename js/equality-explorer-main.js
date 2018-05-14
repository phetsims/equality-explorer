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
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
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

    var sim = new Sim( equalityExplorerTitleString, screens, {
      credits: EqualityExplorerConstants.CREDITS
    } );
    sim.start();
  } );
} );
