// Copyright 2017-2019, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Sim from '../../joist/js/Sim.js';
import SimLauncher from '../../joist/js/SimLauncher.js';
import BasicsScreen from './basics/BasicsScreen.js';
import EqualityExplorerConstants from './common/EqualityExplorerConstants.js';
import equalityExplorerStrings from './equality-explorer-strings.js';
import NumbersScreen from './numbers/NumbersScreen.js';
import OperationsScreen from './operations/OperationsScreen.js';
import SolveItScreen from './solveit/SolveItScreen.js';
import VariablesScreen from './variables/VariablesScreen.js';

const equalityExplorerTitleString = equalityExplorerStrings[ 'equality-explorer' ].title;

SimLauncher.launch( () => {

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