// Copyright 2017, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var functionBuilder = require( 'FUNCTION_BUILDER/functionBuilder' );

  var EqualityExplorerQueryParameters = QueryStringMachine.getAll( {

    // enables console logging
    log: { type: 'flag' },

    // populates the output carousel with 1 card of each type
    populateOutput: { type: 'flag' },

    // makes all animation run slowly, so that things are easier to grab while they're animating
    slow: { type: 'flag' }
  } );

  functionBuilder.register( 'EqualityExplorerQueryParameters', EqualityExplorerQueryParameters );

  return EqualityExplorerQueryParameters;
} );
