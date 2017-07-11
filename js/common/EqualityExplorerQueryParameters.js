// Copyright 2017, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );

  var EqualityExplorerQueryParameters = QueryStringMachine.getAll( {

    // Enables console logging.
    log: { type: 'flag' },

    // Makes all animation run slowly, so that things are easier to grab while they're animating.
    // Useful for testing multi-touch.
    slow: { type: 'flag' },

    // Shows the origin of various objects, typically rendered as a red dot.
    showOrigin: { type: 'flag' },

    // Shows the grid on each of the weighing platforms.
    showGrid: { type: 'flag' },

    // Shows the drag bounds for Items
    showDragBounds: { type: 'flag' },

    // Size of the grid on the scale's weighing platforms.
    // A grid size that exceeds the width of the weighing platforms will result in an assertion failure.
    // Setting to a smaller gridSize is useful for testing what happens when the scale is full.
    gridSize: {
      type: 'array',
      elementSchema: {
        type: 'number'
      },
      defaultValue: [ 6, 6 ]
    }
  } );

  equalityExplorer.register( 'EqualityExplorerQueryParameters', EqualityExplorerQueryParameters );

  // coerce gridSize to Dimension2
  assert && assert( EqualityExplorerQueryParameters.gridSize.length === 2, 'invalid gridSize' );
  EqualityExplorerQueryParameters.gridSize = new Dimension2( EqualityExplorerQueryParameters.gridSize[ 0 ], EqualityExplorerQueryParameters.gridSize[ 1 ] );

  //TODO migrate to common code? This is a pattern that I've been repeating.
  if ( EqualityExplorerQueryParameters.log ) {

    // add a log function that displays messages in green
    equalityExplorer.log = function( message ) {
      console.log( '%clog: ' + message, 'color: #009900' );
    };

    // log the values of all query parameters
    for ( var property in EqualityExplorerQueryParameters ) {
      if ( EqualityExplorerQueryParameters.hasOwnProperty( property ) ) {
        equalityExplorer.log( property + '=' + EqualityExplorerQueryParameters[ property ] );
      }
    }
  }

  return EqualityExplorerQueryParameters;
} );
