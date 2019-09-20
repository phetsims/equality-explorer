// Copyright 2017-2019, University of Colorado Boulder

/**
 * Circular halo that appears around a Node.
 * Used to indicate that two overlapping terms will sum to zero.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Circle = require( 'SCENERY/nodes/Circle' );
  const Color = require( 'SCENERY/util/Color' );
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const EqualityExplorerColors = require( 'EQUALITY_EXPLORER/common/EqualityExplorerColors' );
  const inherit = require( 'PHET_CORE/inherit' );
  const RadialGradient = require( 'SCENERY/util/RadialGradient' );

  /**
   * @param {number} radius
   * @param {Object} [options]
   * @constructor
   */
  function HaloNode( radius, options ) {

    options = _.extend( {
      baseColor: EqualityExplorerColors.HALO
    }, options );

    // halo is fully transparent at the edges
    const edgeColor = Color.toColor( options.baseColor ).withAlpha( 0 );

    assert && assert( !options.fill, 'HaloNode sets fill' );
    options.fill = new RadialGradient( 0, 0, 0, 0, 0, radius )
      .addColorStop( 0.5, options.baseColor )
      .addColorStop( 1, edgeColor );

    Circle.call( this, radius, options );
  }

  equalityExplorer.register( 'HaloNode', HaloNode );

  return inherit( Circle, HaloNode );
} );
 