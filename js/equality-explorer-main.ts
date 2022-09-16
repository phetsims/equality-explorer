// Copyright 2017-2022, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import soundManager from '../../tambo/js/soundManager.js';
import Tandem from '../../tandem/js/Tandem.js';
import BasicsScreen from './basics/BasicsScreen.js';
import EqualityExplorerConstants from './common/EqualityExplorerConstants.js';
import EqualityExplorerStrings from './EqualityExplorerStrings.js';
import NumbersScreen from './numbers/NumbersScreen.js';
import OperationsScreen from './operations/OperationsScreen.js';
import SolveItScreen from './solveit/SolveItScreen.js';
import VariablesScreen from './variables/VariablesScreen.js';

simLauncher.launch( () => {

  const screens = [
    new BasicsScreen( { tandem: Tandem.ROOT.createTandem( 'basicsScreen' ) } ),
    new NumbersScreen( { tandem: Tandem.ROOT.createTandem( 'numbersScreen' ) } ),
    new VariablesScreen( { tandem: Tandem.ROOT.createTandem( 'variablesScreen' ) } ),
    new OperationsScreen( { tandem: Tandem.ROOT.createTandem( 'operationsScreen' ) } ),
    new SolveItScreen( { tandem: Tandem.ROOT.createTandem( 'solveItScreen' ) } )
  ];

  const sim = new Sim( EqualityExplorerStrings[ 'equality-explorer' ].titleStringProperty, screens, {
    credits: EqualityExplorerConstants.CREDITS
  } );
  sim.start();

  soundManager.setOutputLevelForCategory( 'user-interface', 0 );
} );