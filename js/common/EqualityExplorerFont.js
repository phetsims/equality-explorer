// Copyright 2017, University of Colorado Boulder

/**
 * Font used throughout this simulation.
 * Allows us to quickly change font properties for the entire simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var functionBuilder = require( 'FUNCTION_BUILDER/functionBuilder' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  /**
   * @param {number|*} options font size or font options
   * @constructor
   */
  function EqualityExplorerFont( options ) {

    // convenience for specifying font size only, e.g. new EqualityExplorerFont(24)
    if ( typeof options === 'number' ) {
      options = { size: options };
    }

    // font attributes, as specified in the design document
    options = _.extend( {
      family: 'Arial'
    }, options );

    PhetFont.call( this, options );
  }

  functionBuilder.register( 'EqualityExplorerFont', EqualityExplorerFont );

  return inherit( PhetFont, EqualityExplorerFont );
} );
