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
  var Util = require( 'DOT/Util' );

  var EqualityExplorerQueryParameters = QueryStringMachine.getAll( {

    // Makes all animation run slowly, so that things are easier to grab while they're animating.
    // Useful for testing multi-touch.
    slowMotion: { type: 'flag' },

    // Shows the origin of various objects, typically rendered as a red dot.
    showOrigin: { type: 'flag' },

    // Shows the grid on each of the weighing platforms.
    showGrid: { type: 'flag' },

    // Shows the drag bounds for Items.
    // Rendered as a dotted rectangle, color coded to the associated weighing platform.
    showDragBounds: { type: 'flag' },

    // Size of the grid on the scale's weighing platforms.
    // A grid size that exceeds the width of the weighing platforms will result in an assertion failure.
    // Setting to a smaller gridSize is useful for testing what happens when the scale is full.
    gridSize: {
      type: 'array',
      elementSchema: {
        type: 'number'
      },
      defaultValue: [ 6, 6 ], // rows, columns
      isValidValue: function( value ) {
        return ( value.length === 2 ) && ( value[ 0 ] > 0 ) && ( value[ 1 ] > 0 );
      }
    },

    // Number of items that are initially on the left weighing platform.
    // This is intended to be used for debugging and testing, not in production situations.
    // See https://github.com/phetsims/equality-explorer/issues/8
    leftItems: {
      type: 'array',
      elementSchema: {
        type: 'number'
      },
      defaultValue: [ 0, 0, 0 ], // in the order that Items appear in the panel below the scale
      isValidValue: function( array ) {
        // all values are zero or positive integers
        return _.every( array, function( value ) { return value >= 0 && Util.isInteger( value ); } );
      }
    },

    // Similar to leftItems, but for the right weighing platform.
    rightItems: {
      type: 'array',
      elementSchema: {
        type: 'number'
      },
      defaultValue: [ 0, 0, 0 ],
      isValidValue: function( array ) {
        return _.every( array, function( value ) { return value >= 0 && Util.isInteger( value ); } );
      }
    }
  } );

  equalityExplorer.register( 'EqualityExplorerQueryParameters', EqualityExplorerQueryParameters );

  // log the values of all sim-specific query parameters
  phet.log && phet.log( 'query parameters: ' + JSON.stringify( EqualityExplorerQueryParameters, null, 2 ) );

  return EqualityExplorerQueryParameters;
} );
