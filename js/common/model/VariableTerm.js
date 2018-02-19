// Copyright 2017, University of Colorado Boulder

/**
 * VariableTerm is a term associated with a variable (e.g. 'x' ).
 * It can be summed with other VariableTerms that have the same symbol.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Term = require( 'EQUALITY_EXPLORER/common/model/Term' );

  /**
   * @param {string} symbol
   * @param {NumberProperty} weightProperty
   * @param {number} sign - determines the sign of 'x' (1 positive, -1 negative)
   * @param {Node} icon
   * @param {Node} shadow
   * @param {Object} [options]
   * @constructor
   */
  function VariableTerm( symbol, weightProperty, sign, icon, shadow, options ) {

    assert && assert( sign === 1 || sign === -1, 'invalid sign: ' + sign );
    
    // @public
    this.symbol = symbol;

    // @public dynamic weight, since 'x' is a variable
    this.weightProperty = weightProperty;

    // @public (read-only) the sign of 'x' (1 positive, -1 negative)  
    this.sign = sign;

    // @public whether the term's halo is visible
    this.haloVisibleProperty = new BooleanProperty( false );

    Term.call( this, icon, shadow, options );
  }

  equalityExplorer.register( 'VariableTerm', VariableTerm );

  return inherit( Term, VariableTerm, {

    /**
     * Gets the term's weight.
     * @returns {number}
     * @public
     * @override
     */
    get weight() {
      return this.weightProperty.value;
    },

    /**
     * Is this term the inverse of a specified term?
     * @param {Term} term
     * @returns {boolean}
     * @public
     * @override
     */
    isInverseOf: function( term ) {
      return ( this.symbol === term.symbol ) && Term.prototype.isInverseOf.call( this, term );
    }
  } );
} );
 