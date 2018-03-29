// Copyright 2017-2018, University of Colorado Boulder

/**
 * Query parameters that are specific to the Equality Explorer sim.
 *
 * Running with ?log will print these query parameters and their values to the console.
 *
 * Running with ?dev shows the following things that are specific to this sim:
 * - red dot at the origin of each term (geometric center)
 * - red dot at the origin of each plate (geometric center)
 * - red dot at the origin of the scale (top of fulcrum)
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

    // Shows the grid on each of the plates.
    // For internal use only, not public facing.
    showGrid: { type: 'flag' },

    // Add the 'x & y' screen, for testing multi-variable support.
    // For internal use only, not public facing.
    xy: { type: 'flag' },

    // Vertical offset, relative to center of plate, for when a term is considered 'above' the plate.
    // Positive y is down in scenery, so positive values are below the center of the plate.
    // For internal use only, not public facing.
    plateYOffset: {
      type: 'number',
      defaultValue: 18
    },

    // After pressing the universal operator's 'go' button, it is normally disabled until the operation is applied.
    // This prevents users from abusing the button by pressing it repeatedly (rapid-fire), which could
    // cause them to reach the numeric limits of the sim very quickly.  Setting this flag keeps the 'go'
    // button enabled at all times, allowing you to press it repeatedly, for the purposes of testing sim limits.
    // And in case it's not obvious: For internal use only, not public facing.
    goButtonEnabled: { type: 'flag' },

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
      defaultValue: [ 0, 0, 0 ], // in the order that terms appear in the toolbox below the scale
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
      defaultValue: [ 0, 0 ], // in the order that terms appear in the toolbox below the scale
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
      defaultValue: [ 0, 0, 0, 0 ], // in the order that terms appear in the toolbox below the scale
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
