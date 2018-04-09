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

    // Number of rows in the grid.
    // Set this to a smaller number so you can fill up the plate faster.
    // For internal use only, not public facing.
    rows: {
      type: 'number',
      defaultValue: 6,
      isValidValue: function( value ) {
        return value > 0 && value <= 6;
      }
    },

    // Number of columns in the grid.
    // Set this to a smaller number so you can fill up the plate faster.
    // For internal use only, not public facing.
    columns: {
      type: 'number',
      defaultValue: 6,
      isValidValue: function( value ) {
        return value > 0 && value <= 6;
      }
    },

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

    // The largest integer value for any numerator, denominator or constant.
    // Any operation that would exceed this value is canceled, and a dialog is shown.
    // See https://github.com/phetsims/equality-explorer/issues/48
    // For internal use only, not public facing.
    largestInteger: {
      type: 'number',
      defaultValue: 1E9
    },

    // Shows answers to challenges in the 'Solve It!' screen
    // For internal use only, not public facing.
    showAnswers: { type: 'flag' }
  } );

  equalityExplorer.register( 'EqualityExplorerQueryParameters', EqualityExplorerQueryParameters );

  // log the values of all sim-specific query parameters
  phet.log && phet.log( 'query parameters: ' + JSON.stringify( EqualityExplorerQueryParameters, null, 2 ) );

  return EqualityExplorerQueryParameters;
} );
