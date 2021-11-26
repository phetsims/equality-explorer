// Copyright 2017-2021, University of Colorado Boulder

/**
 * Circular halo that appears around a Node.
 * Used to indicate that two overlapping terms will sum to zero.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import { Circle } from '../../../../scenery/js/imports.js';
import { Color } from '../../../../scenery/js/imports.js';
import { RadialGradient } from '../../../../scenery/js/imports.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerColors from '../EqualityExplorerColors.js';

class HaloNode extends Circle {

  /**
   * @param {number} radius
   * @param {Object} [options]
   */
  constructor( radius, options ) {

    options = merge( {
      baseColor: EqualityExplorerColors.HALO
    }, options );

    // halo is fully transparent at the edges
    const edgeColor = Color.toColor( options.baseColor ).withAlpha( 0 );

    assert && assert( !options.fill, 'HaloNode sets fill' );
    options.fill = new RadialGradient( 0, 0, 0, 0, 0, radius )
      .addColorStop( 0.5, options.baseColor )
      .addColorStop( 1, edgeColor );

    super( radius, options );
  }
}

equalityExplorer.register( 'HaloNode', HaloNode );

export default HaloNode;