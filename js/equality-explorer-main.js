// Copyright 2017-2019, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BasicsScreen = require( 'EQUALITY_EXPLORER/basics/BasicsScreen' );
  const EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  const NumbersScreen = require( 'EQUALITY_EXPLORER/numbers/NumbersScreen' );
  const OperationsScreen = require( 'EQUALITY_EXPLORER/operations/OperationsScreen' );
  const Sim = require( 'JOIST/Sim' );
  const SimLauncher = require( 'JOIST/SimLauncher' );
  const SolveItScreen = require( 'EQUALITY_EXPLORER/solveit/SolveItScreen' );
  const VariablesScreen = require( 'EQUALITY_EXPLORER/variables/VariablesScreen' );

  // strings
  const equalityExplorerTitleString = require( 'string!EQUALITY_EXPLORER/equality-explorer.title' );

  SimLauncher.launch( function() {

    // production screens
    const screens = [
      new BasicsScreen(),
      new NumbersScreen(),
      new VariablesScreen(),
      new OperationsScreen(),
      new SolveItScreen()
    ];

    const sim = new Sim( equalityExplorerTitleString, screens, {
      credits: EqualityExplorerConstants.CREDITS
    } );
    sim.start();
  } );
} );
