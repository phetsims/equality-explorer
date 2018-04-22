// Copyright 2017-2018, University of Colorado Boulder

/**
 * MysteryTerm has a fixed weight that is hidden from the user.
 * All interactive mystery terms represent 1 mystery object, and have an implicit coefficient of 1.
 * The visual design of interactive mystery terms does not support a coefficient.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var Fraction = require( 'PHETCOMMON/model/Fraction' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Term = require( 'EQUALITY_EXPLORER/common/model/Term' );

  // constants
  var COEFFICIENT = Fraction.fromInteger( 1 ); // all mystery terms have an implicit coefficient of 1

  /**
   * @param {MysteryObject} mysteryObject
   * @param {Object} [options]
   * @constructor
   */
  function MysteryTerm( mysteryObject, options ) {

    options = options || {};
    assert && assert( !options.constantValue, 'constantValue is a ConstantTerm option' );
    assert && assert( !options.coefficient, 'coefficient is a VariableTerm option' );

    // @public (read-only)
    this.mysteryObject = mysteryObject;

    Term.call( this, COEFFICIENT, options );
  }

  equalityExplorer.register( 'MysteryTerm', MysteryTerm );

  return inherit( Term, MysteryTerm, {

    /**
     * For debugging only. Do not rely on the format of toString.
     * @returns {string}
     * @public
     */
    toString: function() {
      return 'MysteryTerm: ' + this.mysteryObject.debugName + ' ' + this.mysteryObject.weight;
    },

    //-------------------------------------------------------------------------------------------------
    // Below here is the implementation of the Term API
    //-------------------------------------------------------------------------------------------------

    /**
     * Creates a copy of this term, with modifications through options.
     * @param {Object} [options] - same as constructor options
     * @returns {MysteryTerm}
     * @public
     * @override
     */
    copy: function( options ) {
      return new MysteryTerm( this.mysteryObject, _.extend( this.copyOptions(), options ) );
    },

    /**
     * Gets the weight of this term.
     * @returns {Fraction}
     * @public
     * @override
     */
    get weight() {
      return Fraction.fromInteger( this.mysteryObject.weight );
    },

    /**
     * Are this term and the specified term 'like terms'?
     * Mystery terms are 'like' if they are associated with the same mystery object.
     * @param {Term} term
     * @returns {boolean}
     * @public
     * @override
     */
    isLikeTerm: function( term ) {
      return ( term instanceof MysteryTerm ) && ( term.mysteryObject === this.mysteryObject );
    },

    /**
     * Applies an operation to this term, resulting in a new term.
     * @param {UniversalOperation} operation
     * @param {Object} [options] - same as constructor
     * @returns {MysteryTerm|null} - null if the operation is not applicable to this term.
     * @public
     * @override
     */
    applyOperation: function( operation, options ) {
      return null; // operations are not applicable to mystery terms
    }
  } );
} );
 