// Copyright 2018, University of Colorado Boulder

/**
 * The 'Solve It!' screen.
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
  const Property = require( 'AXON/Property' );
  const SolveItModel = require( 'EQUALITY_EXPLORER/solveit/model/SolveItModel' );
  const SolveItScreenView = require( 'EQUALITY_EXPLORER/solveit/view/SolveItScreenView' );

  // strings
  const screenSolveItString = require( 'string!EQUALITY_EXPLORER/screen.solveIt' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function SolveItScreen( options ) {

    options = _.extend( {

      // EqualityExplorerScreen options
      name: screenSolveItString,
      backgroundColorProperty: new Property( EqualityExplorerColors.SOLVE_IT_SCREEN_BACKGROUND ),
      homeScreenIcon: EqualityExplorerScreenIcons.createSolveItHomeScreenIcon(),
      navigationBarIcon: EqualityExplorerScreenIcons.createSolveItNavigationBarIcon()
    }, options );

    EqualityExplorerScreen.call( this,
      function() { return new SolveItModel(); },
      function( model ) { return new SolveItScreenView( model ); },
      options
    );
  }

  equalityExplorer.register( 'SolveItScreen', SolveItScreen );

  return inherit( EqualityExplorerScreen, SolveItScreen );
} );