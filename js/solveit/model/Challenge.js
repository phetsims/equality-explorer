// Copyright 2018-2020, University of Colorado Boulder

/**
 * A challenge, in the form of an equation involving 1 variable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Utils from '../../../../dot/js/Utils.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import equalityExplorer from '../../equalityExplorer.js';

class Challenge {

  /**
   * Form: ax + b = mx + n
   * These letters correspond to the design specification, see
   * https://docs.google.com/document/d/1vG5U9HhcqVGMvmGGXry28PLqlNWj25lStDP2vSWgUOo
   *
   * @param {number} x - value of the variable x
   * @param {Fraction} a - coefficient on the left side of the equation
   * @param {Fraction} b - constant on the left side of the equation
   * @param {Fraction} m - coefficient on the right side of the equation
   * @param {Fraction} n - constant on the right side of the equation
   * @param {string} debugDerivation - derivation details provided by ChallengeGenerator, contains RichText markup
   */
  constructor( x, a, b, m, n, debugDerivation ) {

    assert && assert( Utils.isInteger( x ), 'invalid x: ' + x );
    assert && assert( a instanceof Fraction && a.isReduced(), 'invalid a: ' + a );
    assert && assert( b instanceof Fraction && b.isReduced(), 'invalid b: ' + b );
    assert && assert( m instanceof Fraction && m.isReduced(), 'invalid m: ' + m );
    assert && assert( n instanceof Fraction && n.isReduced(), 'invalid n: ' + n );

    // @public (read-only)
    this.x = x;
    this.a = a;
    this.b = b;
    this.m = m;
    this.n = n;

    // @public (read-only) details about how the challenge was derived, for debugging.
    // With the 'showAnswers' query parameter, this information is displayed in the sim.
    // This information is provided by ChallengeGenerator subtypes, contains RichText markup,
    // and corresponds to the challenge specification in the design document, see
    // https://docs.google.com/document/d/1vG5U9HhcqVGMvmGGXry28PLqlNWj25lStDP2vSWgUOo
    this.debugDerivation = debugDerivation;

    // verify that the we have an equality
    assert && assert( a.timesInteger( x ).plus( b ).reduce().equals( m.timesInteger( x ).plus( n ).reduce() ),
      'challenge is an inequality: ' + this.toString() );
  }

  // @public (debug) do not rely on format!
  toString() {
    return StringUtils.fillIn( '{{a}} x + {{b}} = {{m}} x + {{n}} (x={{x}})', {
      a: fractionToString( this.a ),
      b: fractionToString( this.b ),
      m: fractionToString( this.m ),
      n: fractionToString( this.n ),
      x: this.x
    } );
  }

  // @private

}

/**
 * Converts a Fraction to a string representation.
 * This is done here because Fraction.toString is in common code, and doesn't provide the format that we want.
 * @param {Fraction} f
 * @returns {string}
 */
function fractionToString( f ) {
  assert && assert( f instanceof Fraction, 'invalid f: ' + f );
  return ( f.isInteger() ? f.getValue() : ( f.numerator + '/' + f.denominator ) );
}

equalityExplorer.register( 'Challenge', Challenge );

export default Challenge;