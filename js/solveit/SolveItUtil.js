// Copyright 2018, University of Colorado Boulder

/**
 * Various utility functions that are specific to the 'Solve It!' game.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var Util = require( 'DOT/Util' );

  var SolveItUtil = {

    //TODO delete if not used
    /**
     * Converts a range to an array of integers. Used by game challenge generators.
     * @param {Range} range
     * @param {Object} [options]
     */
    rangeToArray: function( range, options ) {
      assert && assert( Util.isInteger( range.min ), 'range.min must be an integer: ' + range.min );
      assert && assert( Util.isInteger( range.max ), 'range.max must be an integer: ' + range.max );

      options = _.extend( {
        includeZero: true // should zero be included?
      }, options );

      var a = [];
      for ( var i = range.min; i < range.max; i++ ) {
        if ( i !== 0 || options.includeZero ) {
          a.push( i );
        }
      }
    }
  };

  equalityExplorer.register( 'SolveItUtil', SolveItUtil );

  return SolveItUtil;
} );
 