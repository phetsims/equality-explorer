// Copyright 2017-2018, University of Colorado Boulder

/**
 * Circular halo that appears around a Node.
 * Used to indicate that two overlapping terms will sum to zero.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Color = require( 'SCENERY/util/Color' );
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
      baseColor: 'rgba( 255, 255, 0, 0.85 )' // slightly transparent yellow
    }, options );

    // halo is fully transparent at the edges
    var edgeColor = Color.toColor( options.baseColor ).withAlpha( 0 );

    assert && assert( !options.fill, 'this type defines its fill' );
    options.fill = new RadialGradient( 0, 0, 0, 0, 0, radius )
      .addColorStop( 0.5, options.baseColor )
      .addColorStop( 1, edgeColor );

    Circle.call( this, radius, options );
  }

  equalityExplorer.register( 'HaloNode', HaloNode );

  return inherit( Circle, HaloNode );
} );
 