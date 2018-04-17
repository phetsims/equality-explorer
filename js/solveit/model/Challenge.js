// Copyright 2018, University of Colorado Boulder

/**
 * A challenge, in the form of an equation involving 1 variable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var Fraction = require( 'PHETCOMMON/model/Fraction' );
  var inherit = require( 'PHET_CORE/inherit' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  /**
   * Form: ax + b = mx + n
   *
   * @param {number} x
   * @param {Fraction} a
   * @param {Fraction} b
   * @param {Fraction} m
   * @param {Fraction} n
   * @param {string} debugOrigin - identifies the level, type and form of the challenge
   * @param {string} debugDerivation - identifies the derived values that were used to create the challenge
   * @constructor
   */
  function Challenge( x, a, b, m, n, debugOrigin, debugDerivation ) {

    assert && assert( typeof x === 'number', 'invalid x: ' + x );
    assert && assert( a instanceof Fraction && a.isReduced(), 'invalid a: ' + a );
    assert && assert( b instanceof Fraction && a.isReduced(), 'invalid b: ' + b );
    assert && assert( m instanceof Fraction && a.isReduced(), 'invalid m: ' + m );
    assert && assert( n instanceof Fraction && n.isReduced(), 'invalid n: ' + n );

    // @public (read-only)
    this.x = x;
    this.a = a;
    this.b = b;
    this.m = m;
    this.n = n;

    // @public (read-only)
    this.debugOrigin = debugOrigin;
    this.debugDerivation = debugDerivation;
  }

  equalityExplorer.register( 'Challenge', Challenge );

  return inherit( Object, Challenge, {

    // @public (debug) do not rely on format!
    toRichText: function() {
      return this.debugOrigin + '<br>' + this.debugDerivation + '<br>' + this.toString();
    },

    // @public (debug) do not rely on format!
    toString: function() {
      return StringUtils.fillIn( 'x={{x}}, {{a}} x + {{b}} = {{m}} x + {{n}}', {
        x: this.x,
        a: this.a,
        b: this.b,
        m: this.m,
        n: this.n
      } );
    }
  } );
} ); 