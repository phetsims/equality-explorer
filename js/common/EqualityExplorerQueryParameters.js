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

  var EqualityExplorerQueryParameters = QueryStringMachine.getAll( {

    // Shows the grid on each of the plates.
    // For internal use only, not public facing.
    showGrid: { type: 'flag' },

    // Number of rows in the grid on each plate in the 'Basics', 'Numbers' and 'Variables' screens.
    // Set this to a smaller number so you can fill up the plate faster.
    // For internal use only, not public facing.
    rows: {
      type: 'number',
      defaultValue: 6,
      isValidValue: function( value ) {
        return value > 0 && value <= 6;
      }
    },

    // Number of columns in the grid on each plate in the 'Basics', 'Numbers' and 'Variables' screens.
    // Set this to a smaller number so you can fill up the plate faster.
    // For internal use only, not public facing.
    columns: {
      type: 'number',
      defaultValue: 6,
      isValidValue: function( value ) {
        return value > 0 && value <= 6;
      }
    },

    // Adds the 'x & y' screen, for testing multi-variable support.
    // For internal use only, not public facing.
    xy: { type: 'flag' },

    // Vertical offset, relative to center of plate, for when a term is considered 'above' the plate.
    // Positive y is down in scenery, so positive values are below the center of the plate.
    // For internal use only, not public facing.
    plateYOffset: {
      type: 'number',
      defaultValue: 18
    },

    // The largest absolute integer value for any numerator, denominator or constant.
    // Any operation that would exceed this value is canceled, and a dialog is shown.
    // See https://github.com/phetsims/equality-explorer/issues/48
    // For internal use only, not public facing.
    maxInteger: {
      type: 'number',
      defaultValue: 1E9,
      isValidValue: function( value ) {
        return value > 0;
      }
    },

    // Shows answers to challenges in the 'Solve It!' screen.
    // If assertions are enabled, this also adds a 'test challenge generators' button to the level-selection UI.
    // For internal use only, not public facing.
    showAnswers: { type: 'flag' },

    // Reaching this score results in a reward.
    // For internal use only, not public facing.
    rewardScore: {
      type: 'number',
      defaultValue: 10,
      isValidValue: function( value ) {
        return value > 0;
      }
    },

    // A specific challenge that will be used throughout the Solve It! screen.
    // Used to test and debug a specific challenge, e.g. https://github.com/phetsims/equality-explorer/issues/71.
    // Format is [x,a1,a2,b1,b2,m1,m2,n1,n2] where a1/a2 x + b1/b2 = m1/m2 x + n1/n1.
    // Example: challenge=6,-7,2,4,1,0,1,-17,1 -> x=6, -7/2 x + 4 = -17
    // For internal use only, not public facing.
    challenge: {
      type: 'array',
      elementSchema: {
        type: 'number'
      },
      defaultValue: null,
      isValidValue: function( value ) {
        return ( value === null ) || ( value.length === 9 );
      }
    }
  } );

  equalityExplorer.register( 'EqualityExplorerQueryParameters', EqualityExplorerQueryParameters );

  // log the values of all sim-specific query parameters
  phet.log && phet.log( 'query parameters: ' + JSON.stringify( EqualityExplorerQueryParameters, null, 2 ) );

  return EqualityExplorerQueryParameters;
} );
