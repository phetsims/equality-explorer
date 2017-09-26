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

    // Shows the origin of various objects, rendered as a red dot.
    showOrigin: { type: 'flag' },

    // Shows the grid on each of the plates.
    showGrid: { type: 'flag' },

    // Shows the drag bounds for Items.
    // Rendered as a dotted rectangle, color coded to the associated plate.
    showDragBounds: { type: 'flag' },

    //TODO delete gridSize when design has stabilized
    // Size of the grid on the scale's plates.
    // A grid size that exceeds the width of the plates will result in an assertion failure.
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

    // Number of items that are initially on the left plate in the Basics screen.
    // This is intended to be used for debugging and testing, not in production situations.
    // See https://github.com/phetsims/equality-explorer/issues/8
    leftBasics: {
      type: 'array',
      elementSchema: {
        type: 'number'
      },
      defaultValue: [ 0, 0, 0 ], // in the order that Items appear in the panel below the scale
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

    leftNumbers: {
      type: 'array',
      elementSchema: {
        type: 'number'
      },
      defaultValue: [ 0, 0 ], // in the order that Items appear in the panel below the scale
      isValidValue: function( value ) {
        return isValidItemsArray( value, 2 );
      }
    },

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

    leftVariables: {
      type: 'array',
      elementSchema: {
        type: 'number'
      },
      defaultValue: [ 0, 0, 0, 0 ], // in the order that Items appear in the panel below the scale
      isValidValue: function( value ) {
        return isValidItemsArray( value, 4 );
      }
    },

    rightVariables: {
      type: 'array',
      elementSchema: {
        type: 'number'
      },
      defaultValue: [ 0, 0, 0, 0 ],
      isValidValue: function( value ) {
        return isValidItemsArray( value, 4 );
      }
    },

    //TODO delete fruitWeights when design has stabilized
    // Specify the weights for Items in Fruit scene of the Basics screen.
    // This is a development feature for testing how the scale moves with various weights.
    fruitWeights: {
      type: 'array',
      elementSchema: {
        type: 'number'
      },
      defaultValue: [ 3, 2, 1 ]
    },

    // TODO delete fulcrumHeight when design has stabilized
    // Height of the scale's fulcrum, on which the balance beam sits.
    fulcrumHeight: {
      type: 'number',
      defaultValue: 52,
      isValidValue: function( value ) {
        return value > 0;
      }
    },

    // TODO delete plateSupportHeight when design has stabilized
    plateSupportHeight: {
      type: 'number',
      defaultValue: 70,
      isValidValue: function( value ) {
        return value > 0;
      }
    },

    // TODO delete maxScaleAngle when design has stabilized
    // maximum angle that the scale can move (plus or minus) in degrees
    maxScaleAngle: {
      type: 'number',
      defaultValue: 22, // degrees
      isValidValue: function( value ) {
        return value > 0 && value < 90;
      }
    },

    // TODO delete maxWeight when design has stabilized
    // maximum weight at which a plate 'bottoms out', and won't move when more weight is added to it
    maxWeight: {
      type: 'number',
      defaultValue: 30,
      isValidValue: function( value ) {
        return value > 0;
      }
    },

    // TODO delete scaleY when design has stabilized
    // y coordinate for the scale's location, the point where the fulcrum contacts the balance beam
    scaleY: {
      type: 'number',
      defaultValue: 420
    }
  } );

  equalityExplorer.register( 'EqualityExplorerQueryParameters', EqualityExplorerQueryParameters );

  // Validates an array that indicates the number of Items on a plate
  function isValidItemsArray( array, length ) {
    return ( array.length === length ) &&
           // every value in the array is an integer
           ( _.every( array, function( value ) { return value >= 0 && Util.isInteger( value ); } ) ) &&
           // sum of values in the array doesn't exceed number of cells
           ( _.reduce( array, function( sum, n ) { return sum + n; } ) <= 36 );
  }

  // log the values of all sim-specific query parameters
  phet.log && phet.log( 'query parameters: ' + JSON.stringify( EqualityExplorerQueryParameters, null, 2 ) );

  return EqualityExplorerQueryParameters;
} );
