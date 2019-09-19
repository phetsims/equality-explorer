// Copyright 2018, University of Colorado Boulder

/**
 * A challenge created by reading the 'challenge' query parameter. See EqualityExplorerQueryParameters.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Challenge = require( 'EQUALITY_EXPLORER/solveit/model/Challenge' );
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  const Fraction = require( 'PHETCOMMON/model/Fraction' );
  const inherit = require( 'PHET_CORE/inherit' );

  /**
   * @constructor
   */
  function DebugChallenge() {

    const values = EqualityExplorerQueryParameters.challenge;
    assert && assert( values, 'query parameter challenge is not set' );

    let i = 0;
    const a = new Fraction( values[ i++ ], values[ i++ ] );
    const b = new Fraction( values[ i++ ], values[ i++ ] );
    const m = new Fraction( values[ i++ ], values[ i++ ] );
    const n = new Fraction( values[ i++ ], values[ i++ ] );
    const x = values[ i++ ];

    Challenge.call( this, x, a, b, m, n, '?challenge' );
  }

  equalityExplorer.register( 'DebugChallenge', DebugChallenge );

  return inherit( Challenge, DebugChallenge );
} );