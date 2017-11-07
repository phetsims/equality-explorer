// Copyright 2017, University of Colorado Boulder

/**
 * Halo that appears around overlapping items that will sum to zero.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );

  // constants
  var CENTER_COLOR = 'rgba( 255, 255, 0, 1 )'; // opaque yellow
  var EDGE_COLOR = 'rgba( 255, 255, 0, 0 )'; // transparent yellow

  /**
   * @param {number} radius
   * @param {Object} [options]
   * @constructor
   */
  function HaloNode( radius, options ) {
    
    options = options || {};

    assert && assert( !options.fill, 'this type defines its fill' );
    options.fill = new RadialGradient( 0, 0, 0, 0, 0, radius )
      .addColorStop( 0.25, CENTER_COLOR )
      .addColorStop( 1, EDGE_COLOR );

    Circle.call( this, radius, options );
  }

  equalityExplorer.register( 'HaloNode', HaloNode );

  return inherit( Circle, HaloNode );
} );
 