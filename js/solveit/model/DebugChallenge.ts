// Copyright 2018-2022, University of Colorado Boulder

/**
 * A challenge created by reading the 'challenge' query parameter. See EqualityExplorerQueryParameters.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import EqualityExplorerQueryParameters from '../../common/EqualityExplorerQueryParameters.js';
import equalityExplorer from '../../equalityExplorer.js';
import Challenge from './Challenge.js';

export default class DebugChallenge extends Challenge {

  public constructor() {

    const values = EqualityExplorerQueryParameters.challenge;
    assert && assert( values, 'query parameter challenge is not set' );

    let i = 0;
    const a = new Fraction( values[ i++ ], values[ i++ ] );
    const b = new Fraction( values[ i++ ], values[ i++ ] );
    const m = new Fraction( values[ i++ ], values[ i++ ] );
    const n = new Fraction( values[ i++ ], values[ i++ ] );
    const x = values[ i++ ];

    super( x, a, b, m, n, '?challenge' );
  }
}

equalityExplorer.register( 'DebugChallenge', DebugChallenge );