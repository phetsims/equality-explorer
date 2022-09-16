// Copyright 2017-2022, University of Colorado Boulder

/**
 * Circular halo that appears around a Node.
 * Used to indicate that two overlapping terms will sum to zero.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import { Circle, CircleOptions, Color, NodeTranslationOptions, RadialGradient, TColor } from '../../../../scenery/js/imports.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerColors from '../EqualityExplorerColors.js';

type SelfOptions = {
  baseColor?: TColor;
};

type HaloNodeOptions = SelfOptions & NodeTranslationOptions & PickOptional<CircleOptions, 'visible'>;

export default class HaloNode extends Circle {

  public constructor( radius: number, providedOptions?: HaloNodeOptions ) {

    const options = optionize<HaloNodeOptions, SelfOptions, CircleOptions>()( {

      // SelfOptions
      baseColor: EqualityExplorerColors.HALO
    }, providedOptions );

    // fully transparent at the edges
    const edgeColor = Color.toColor( options.baseColor ).withAlpha( 0 );

    options.fill = new RadialGradient( 0, 0, 0, 0, 0, radius )
      .addColorStop( 0.5, options.baseColor )
      .addColorStop( 1, edgeColor );

    super( radius, options );
  }
}

equalityExplorer.register( 'HaloNode', HaloNode );