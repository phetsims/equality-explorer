// Copyright 2017, University of Colorado Boulder

//TODO This is really a VariableTerm whose variable value is not exposed.
/**
 * MysteryTerm is a term that has a constant weight, but that weight is not revealed to the user.
 * MysteryTerms do not contribute to the constant term in an equation.  They are represented as
 * a coefficient and an icon.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Term = require( 'EQUALITY_EXPLORER/common/model/Term' );

  /**
   * @param {number} weight
   * @param {Node} icon
   * @param {Node} shadow
   * @param {Object} [options]
   * @constructor
   */
  function MysteryTerm( weight, icon, shadow, options ) {

    // @private
    this._weight = weight;

    Term.call( this, icon, shadow, options );
  }

  equalityExplorer.register( 'MysteryTerm', MysteryTerm );

  return inherit( Term, MysteryTerm, {

    /**
     * Gets the term's weight.
     * @returns {number}
     * @public
     * @override
     */
    get weight() {
      return this._weight;
    }

    //TODO isInverseOf is not used for MysteryTerm, but it's incorrect. Returns true for different terms with inverse weight.
  } );
} );
 