// Copyright 2017, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );

  var EqualityExplorerQueryParameters = QueryStringMachine.getAll( {

    // enables console logging
    log: { type: 'flag' },

    // makes all animation run slowly, so that things are easier to grab while they're animating
    slow: { type: 'flag' }
  } );

  equalityExplorer.register( 'EqualityExplorerQueryParameters', EqualityExplorerQueryParameters );

  // enable logging to the console
  if ( EqualityExplorerQueryParameters.log ) {

    console.log( 'enabling log' );
    equalityExplorer.log = function( message ) {
      console.log( '%clog: ' + message, 'color: #009900' ); // display messages in green
    };

    equalityExplorer.log( 'slow=' + EqualityExplorerQueryParameters.slow );
  }

  return EqualityExplorerQueryParameters;
} );
