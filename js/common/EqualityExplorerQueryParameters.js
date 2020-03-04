// Copyright 2017-2020, University of Colorado Boulder

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
 * - red horizontal line that denotes the cutoff of 'on' vs 'off' the scale, when dragging terms
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import equalityExplorer from '../equalityExplorer.js';

const EqualityExplorerQueryParameters = QueryStringMachine.getAll( {

  // Shows the grid on each of the plates.
  // For internal use only, not public facing.
  showGrid: { type: 'flag' },

  // Number of rows in the grid on each plate in the 'Basics', 'Numbers' and 'Variables' screens.
  // Set this to a smaller number so you can fill up the plate faster.
  // For internal use only, not public facing.
  rows: {
    type: 'number',
    defaultValue: 6,
    isValidValue: value => ( value > 0 && value <= 6 )
  },

  // Number of columns in the grid on each plate in the 'Basics', 'Numbers' and 'Variables' screens.
  // Set this to a smaller number so you can fill up the plate faster.
  // For internal use only, not public facing.
  columns: {
    type: 'number',
    defaultValue: 6,
    isValidValue: value => ( value > 0 && value <= 6 )
  },

  // Vertical offset, relative to center of plate, for when a term is considered 'above' the plate.
  // Positive y is down in scenery, so positive values are below the center of the plate.
  // For internal use only, not public facing.
  plateYOffset: {
    type: 'number',
    defaultValue: 18
  },

  // The largest absolute integer value for any numerator, denominator or constant.
  // Any operation or interaction that would exceed this value is canceled, and a dialog is shown.
  // See https://github.com/phetsims/equality-explorer/issues/48
  // For internal use only, not public facing.
  maxInteger: {
    type: 'number',
    defaultValue: 1E9,
    isValidValue: value => ( value > 0 )
  },

  // Reaching this score results in a reward.
  // For internal use only, not public facing.
  rewardScore: {
    type: 'number',
    defaultValue: 10,
    isValidValue: value => ( value > 0 )
  },

  // Describes a challenge that will be used throughout the Solve It! screen.
  // Used to test and debug a specific challenge, e.g. https://github.com/phetsims/equality-explorer/issues/71.
  // Format is [a1,a2,b1,b2,m1,m2,n1,n2,x] where a1/a2 x + b1/b2 = m1/m2 x + n1/n1.
  // Example: to test -7/2 x + 4 = -17 (x=6), use challenge=-7,2,4,1,0,1,-17,1,6
  // For internal use only, not public facing.
  challenge: {
    type: 'array',
    elementSchema: {
      type: 'number'
    },
    defaultValue: null,
    isValidValue: value => ( value === null ) || ( value.length === 9 )
  },

  // Turns the lock feature 'on' by default.
  // For internal use only, not public facing.
  locked: { type: 'flag' },

  // Whether the lock control is visible.  When used with the 'locked' query parameter, this is useful for keeping
  // the sim in the locked or unlocked state while memory profiling or fuzz testing.
  // For example, use ?locked&lockVisible=false to profile the sim in the locked state.
  // For internal use only, not public facing.
  lockVisible: {
    type: 'boolean',
    defaultValue: true
  }
} );

equalityExplorer.register( 'EqualityExplorerQueryParameters', EqualityExplorerQueryParameters );

// log the values of all sim-specific query parameters
phet.log && phet.log( 'query parameters: ' + JSON.stringify( EqualityExplorerQueryParameters, null, 2 ) );

export default EqualityExplorerQueryParameters;