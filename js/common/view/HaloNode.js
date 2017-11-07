// Copyright 2017, University of Colorado Boulder

/**
 * Circular halo that appears around a Node.
 * Used to indicate that two overlapping items will sum to zero.
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

  /**
   * @param {number} radius
   * @param {Object} [options]
   * @constructor
   */
  function HaloNode( radius, options ) {

    options = _.extend( {
      centerColor: 'rgba( 255, 255, 0, 1 )', // opaque yellow
      edgeColor: 'rgba( 255, 255, 0, 0 )' // transparent yellow
    }, options );

    assert && assert( !options.fill, 'this type defines its fill' );
    options.fill = new RadialGradient( 0, 0, 0, 0, 0, radius )
      .addColorStop( 0.25, options.centerColor )
      .addColorStop( 1, options.edgeColor );

    Circle.call( this, radius, options );
  }

  equalityExplorer.register( 'HaloNode', HaloNode );

  return inherit( Circle, HaloNode );
} );
 