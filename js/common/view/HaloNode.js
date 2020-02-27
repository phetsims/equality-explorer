// Copyright 2017-2019, University of Colorado Boulder

/**
 * Circular halo that appears around a Node.
 * Used to indicate that two overlapping terms will sum to zero.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Color from '../../../../scenery/js/util/Color.js';
import RadialGradient from '../../../../scenery/js/util/RadialGradient.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerColors from '../EqualityExplorerColors.js';

/**
 * @param {number} radius
 * @param {Object} [options]
 * @constructor
 */
function HaloNode( radius, options ) {

  options = merge( {
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

inherit( Circle, HaloNode );
export default HaloNode;