// Copyright 2017, University of Colorado Boulder

/**
 * The 'Solving' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerColors = require( 'EQUALITY_EXPLORER/common/EqualityExplorerColors' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );
  var SolvingModel = require( 'EQUALITY_EXPLORER/solving/model/SolvingModel' );
  var SolvingScreenView = require( 'EQUALITY_EXPLORER/solving/view/SolvingScreenView' );

  // strings
  var screenSolvingString = require( 'string!EQUALITY_EXPLORER/screen.solving' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function SolvingScreen( options ) {

    options = _.extend( {
      name: screenSolvingString,
      backgroundColorProperty: new Property( EqualityExplorerColors.SOLVING_SCREEN_BACKGROUND )
    }, options );

    Screen.call( this,
      function() { return new SolvingModel(); },
      function( model ) { return new SolvingScreenView( model ); },
      options
    );
  }

  equalityExplorer.register( 'SolvingScreen', SolvingScreen );

  return inherit( Screen, SolvingScreen );
} );