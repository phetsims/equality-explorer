// Copyright 2018, University of Colorado Boulder

//TODO generalize this to Equation and use for EquationNode?
/**
 * A challenge, in the form of an equation involving 1 variable.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ConstantTerm = require( 'EQUALITY_EXPLORER/common/model/ConstantTerm' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var Fraction = require( 'PHETCOMMON/model/Fraction' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Variable = require( 'EQUALITY_EXPLORER/common/model/Variable' );
  var VariableTerm = require( 'EQUALITY_EXPLORER/common/model/VariableTerm' );

  // strings
  var xString = require( 'string!EQUALITY_EXPLORER/x' );

  /**
   * Form: ax + b = mx + n
   *
   * @param {number} x
   * @param {Fraction} a
   * @param {Fraction} b
   * @param {Fraction} m
   * @param {Fraction} n
   * @param {string} debugDescription - debugging description
   * @constructor
   */
  function Challenge( x, a, b, m, n, debugDescription ) {

    assert && assert( typeof x === 'number', 'invalid x: ' + x );
    assert && assert( a instanceof Fraction && a.isReduced(), 'invalid a: ' + a );
    assert && assert( b instanceof Fraction && a.isReduced(), 'invalid b: ' + b );
    assert && assert( m instanceof Fraction && a.isReduced(), 'invalid m: ' + m );
    assert && assert( n instanceof Fraction && n.isReduced(), 'invalid n: ' + n );

    // @public (read-only)
    this.variable = new Variable( xString, { value: x } );
    this.leftVariableTerm = new VariableTerm( this.variable, { coefficient: a } );
    this.leftConstantTerm = new ConstantTerm( { constantValue: b } );
    this.rightVariableTerm = new VariableTerm( this.variable, { coefficient: m } );
    this.rightConstantTerm = new ConstantTerm( { constantValue: n } );
    this.debugDescription = debugDescription;

    phet.log && phet.log( 'Challenge: ' + this.toString() );
  }

  equalityExplorer.register( 'Challenge', Challenge );

  return inherit( Object, Challenge, {

    /**
     * For debugging only, do not rely on the format of toString!
     * @returns {string}
     */
    toString: function() {
      return '' + this.debugDescription + ', ' +
             this.leftVariableTerm.coefficient + ' ' + xString + ' + ' +
             this.leftConstantTerm.constantValue +
             ' = ' +
             this.rightVariableTerm.coefficient + ' ' + xString + ' + ' +
             this.rightConstantTerm.constantValue;
    }
  } );
} ); 