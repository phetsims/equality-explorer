// Copyright 2017-2018, University of Colorado Boulder

/**
 * Query parameters that are specific to the Equality Explorer sim.
 *
 * Running with ?log will print these query parameters and their values to the console.
 *
 * Running with ?dev shows the following things that are specific to this sim:
 * - red dot at the origin of each term
 * - red dot at the origin of each plate
 * - red dot at the origin of the scale
 * - red rectangle for drag bounds on each side of the scale
 * - red horizontal line that denotes the cutoff of on vs off the scale, when dragging terms
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
    // Useful for testing multi-touch, so that terms are easier to grab while they're moving.
    // For internal use only, not public facing.
    speed: {
      type: 'number',
      defaultValue: 1,
      isValidValue: function( value ) {
        return value > 0;
      }
    },

    //TODO if we decide NOT to show grid in production version, replace this with phet.chipper.queryParameters.dev
    // Shows the grid on each of the plates.
    // For internal use only, not public facing.
    showGrid: { type: 'flag' },

    // Add the 'x & y' screen, for testing multi-variable support.
    // For internal use only, not public facing.
    xy: { type: 'flag' },

    // Number of terms that are initially on the left plate in the Basics screen.
    // This is intended to be used for debugging and testing, not in production situations.
    // Example: ?leftBasics=10,11,12
    // See https://github.com/phetsims/equality-explorer/issues/8
    // For internal use only, not public facing.
    leftBasics: {
      type: 'array',
      elementSchema: {
        type: 'number'
      },
      defaultValue: [ 0, 0, 0 ], // in the order that terms appear in the panel below the scale
      isValidValue: function( value ) {
        return isValidTermsArray( value, 3 );
      }
    },

    // Similar to leftBasics, but for the right plate in the Basics screen.
    // For internal use only, not public facing.
    rightBasics: {
      type: 'array',
      elementSchema: {
        type: 'number'
      },
      defaultValue: [ 0, 0, 0 ],
      isValidValue: function( value ) {
        return isValidTermsArray( value, 3 );
      }
    },

    // Similar to leftBasics, but for the Numbers screen.
    // For internal use only, not public facing.
    leftNumbers: {
      type: 'array',
      elementSchema: {
        type: 'number'
      },
      defaultValue: [ 0, 0 ], // in the order that terms appear in the panel below the scale
      isValidValue: function( value ) {
        return isValidTermsArray( value, 2 );
      }
    },

    // Similar to rightBasics, but for the Numbers screen.
    // For internal use only, not public facing.
    rightNumbers: {
      type: 'array',
      elementSchema: {
        type: 'number'
      },
      defaultValue: [ 0, 0 ],
      isValidValue: function( value ) {
        return isValidTermsArray( value, 2 );
      }
    },

    // Similar to leftBasics, but for the Variables screen.
    // For internal use only, not public facing.
    leftVariables: {
      type: 'array',
      elementSchema: {
        type: 'number'
      },
      defaultValue: [ 0, 0, 0, 0 ], // in the order that terms appear in the panel below the scale
      isValidValue: function( value ) {
        return isValidTermsArray( value, 4 );
      }
    },

    // Similar to rightBasics, but for the Variables screen.
    // For internal use only, not public facing.
    rightVariables: {
      type: 'array',
      elementSchema: {
        type: 'number'
      },
      defaultValue: [ 0, 0, 0, 0 ],
      isValidValue: function( value ) {
        return isValidTermsArray( value, 4 );
      }
    },

    // Offset, relative to center of plate, for when a term is considered 'above' the plate.
    // For internal use only, not public facing.
    plateYOffset: {
      type: 'number',
      defaultValue: 18
    }
  } );

  equalityExplorer.register( 'EqualityExplorerQueryParameters', EqualityExplorerQueryParameters );

  /**
   * Validates an array that indicates the number of terms on a plate.
   * @param {[]} array
   * @param {number} length - required length of array
   * @returns {boolean}
   */
  function isValidTermsArray( array, length ) {
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
