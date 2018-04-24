// Copyright 2018, University of Colorado Boulder

/**
 * A challenge created by reading the 'challenge' query parameter. See EqualityExplorerQueryParameters.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Challenge = require( 'EQUALITY_EXPLORER/solveit/model/Challenge' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var Fraction = require( 'PHETCOMMON/model/Fraction' );
  var inherit = require( 'PHET_CORE/inherit' );

  function DebugChallenge() {

    var values = EqualityExplorerQueryParameters.challenge;
    assert && assert( values, 'query parameter challenge is not set' );

    var i = 0;
    var x = values[ i++ ];
    var a = new Fraction( values[ i++ ], values[ i++ ] );
    var b = new Fraction( values[ i++ ], values[ i++ ] );
    var m = new Fraction( values[ i++ ], values[ i++ ] );
    var n = new Fraction( values[ i++ ], values[ i++ ] );

    Challenge.call( this, x, a, b, m, n, '?challenge' );
  }

  equalityExplorer.register( 'DebugChallenge', DebugChallenge );

  return inherit( Challenge, DebugChallenge );
} );