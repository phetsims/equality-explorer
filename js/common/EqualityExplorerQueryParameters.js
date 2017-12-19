// Copyright 2017, University of Colorado Boulder

/**
 * Query parameters that are specific to the Equality Explorer sim.
 * Running with ?log will print these query parameters and their values to the console.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var Util = require( 'DOT/Util' );

  var EqualityExplorerQueryParameters = QueryStringMachine.getAll( {

    // Speed multiplier for all animations, including motion, fades, etc.
    // Normal speed is 1. Larger values make animations run faster, smaller values make animations run slower.
    // For example, ?speed=0.5 will make animations run at half the normal speed.
    // Useful for testing multi-touch, so that items are easier to grab while they're moving.
    speed: {
      type: 'number',
      defaultValue: 1
    },

    // Shows the origin of various objects, rendered as a red dot.
    showOrigin: { type: 'flag' },

    // Shows the grid on each of the plates.
    showGrid: { type: 'flag' },

    // Shows the drag bounds for items, rendered as a red rectangle.
    showDragBounds: { type: 'flag' },

    // Add the 'x & y' screen, for testing multi-variable support in equations and 'sum to zero' feature.
    xy: { type: 'flag' },

    // Number of items that are initially on the left plate in the Basics screen.
    // This is intended to be used for debugging and testing, not in production situations.
    // See https://github.com/phetsims/equality-explorer/issues/8
    leftBasics: {
      type: 'array',
      elementSchema: {
        type: 'number'
      },
      defaultValue: [ 0, 0, 0 ], // in the order that items appear in the panel below the scale
      isValidValue: function( value ) {
        return isValidItemsArray( value, 3 );
      }
    },

    // Similar to leftBasics, but for the right plate in the Basics screen.
    rightBasics: {
      type: 'array',
      elementSchema: {
        type: 'number'
      },
      defaultValue: [ 0, 0, 0 ],
      isValidValue: function( value ) {
        return isValidItemsArray( value, 3 );
      }
    },

    // Similar to leftBasics, but for the Numbers screen.
    leftNumbers: {
      type: 'array',
      elementSchema: {
        type: 'number'
      },
      defaultValue: [ 0, 0 ], // in the order that items appear in the panel below the scale
      isValidValue: function( value ) {
        return isValidItemsArray( value, 2 );
      }
    },

    // Similar to rightBasics, but for the Numbers screen.
    rightNumbers: {
      type: 'array',
      elementSchema: {
        type: 'number'
      },
      defaultValue: [ 0, 0 ],
      isValidValue: function( value ) {
        return isValidItemsArray( value, 2 );
      }
    },

    // Similar to leftBasics, but for the Variables screen.
    leftVariables: {
      type: 'array',
      elementSchema: {
        type: 'number'
      },
      defaultValue: [ 0, 0, 0, 0 ], // in the order that items appear in the panel below the scale
      isValidValue: function( value ) {
        return isValidItemsArray( value, 4 );
      }
    },

    // Similar to rightBasics, but for the Variables screen.
    rightVariables: {
      type: 'array',
      elementSchema: {
        type: 'number'
      },
      defaultValue: [ 0, 0, 0, 0 ],
      isValidValue: function( value ) {
        return isValidItemsArray( value, 4 );
      }
    }
  } );

  equalityExplorer.register( 'EqualityExplorerQueryParameters', EqualityExplorerQueryParameters );

  /**
   * Validates an array that indicates the number of items on a plate.
   * @param {[]} array
   * @param {number} length - required length of array
   * @returns {boolean}
   */
  function isValidItemsArray( array, length ) {
    return ( array.length === length ) &&
           // every value in the array is an integer
           ( _.every( array, function( value ) { return value >= 0 && Util.isInteger( value ); } ) ) &&
           // sum of values in the array doesn't exceed number of cells in grid
           ( _.reduce( array, function( sum, n ) { return sum + n; } ) <= 36 );
  }

  // log the values of all sim-specific query parameters
  phet.log && phet.log( 'query parameters: ' + JSON.stringify( EqualityExplorerQueryParameters, null, 2 ) );

  return EqualityExplorerQueryParameters;
} );
