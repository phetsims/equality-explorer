// Copyright 2018, University of Colorado Boulder

/**
 * MysteryTermCreator creates and manages terms that are associated with mystery objects (apple, dog, turtle,...)
 * Mystery objects are objects whose (constant) weight is not revealed to the user.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MysteryTerm = require( 'EQUALITY_EXPLORER/basics/model/MysteryTerm' );
  var MysteryTermNode = require( 'EQUALITY_EXPLORER/basics/view/MysteryTermNode' );
  var TermCreator = require( 'EQUALITY_EXPLORER/common/model/TermCreator' );

  /**
   * @param {MysteryObject} mysteryObject
   * @param {Object} [options]
   * @constructor
   */
  function MysteryTermCreator( mysteryObject, options ) {

    phet.log && phet.log( 'MysteryTermCreator name=' + mysteryObject.name + ', weight=' + mysteryObject.weight );

    // @public (read-only)
    this.mysteryObject = mysteryObject;

    var icon = MysteryTermNode.createIcon( mysteryObject.image );

    TermCreator.call( this, icon, options );
  }

  equalityExplorer.register( 'MysteryTermCreator', MysteryTermCreator );

  return inherit( TermCreator, MysteryTermCreator, {

    /**
     * Instantiates a MysteryTerm.
     * @param {Object} [options] - passed to the Term's constructor
     * @returns {Term}
     * @protected
     * @override
     */
    createTermProtected: function( options ) {

      options = _.extend( {
        location: this.location,
        dragBounds: this.dragBounds
      }, options );

      return new MysteryTerm( this.mysteryObject, this, options );
    },

    /**
     * Creates a new term by combining this term with another term.
     * @param {Term} term1
     * @param {Term} term2
     * @param {Object} options
     * @returns {Term|null}
     * @public
     * @override
     */
    combineTerms: function( term1, term2, options ) {
       throw new Error( 'combineTerms is not supported by MysteryTermCreator' );
    },

    /**
     * Copies the specified term, with possible modifications specified via options.
     * @param {Term} term
     * @param {Object} [options]
     * @returns {Term}
     */
    copyTerm: function( term, options ) {
      throw new Error( 'copyTerm is not supported by MysteryTermCreator' );
    },

    /**
     * Instantiates the Node that corresponds to this term.
     * @param {Term} term
     * @param {Plate} plate
     * @param {Object} options - passed to the TermNode's constructor
     * @returns {TermNode}
     * @public
     * @override
     */
    createTermNode: function( term, plate, options ) {
      return new MysteryTermNode( this, term, plate, options );
    },

    /**
     * Applies a universal operation to a term on the scale.
     * @param {UniversalOperation} operation
     * @param {Term} term
     * @returns {Term|null} the new term, null if the the operation resulted in zero
     * @public
     * @override
     */
    applyOperationToTerm: function( operation, term ) {
      throw new Error( 'applyOperationToTerm is not supported by MysteryTermCreator' );
    },

    /**
     * Applies a universal operation to the plate.
     * @param {UniversalOperation} operation
     * @returns {Term|null} the term created, null if no term was created
     * @public
     * @abstract
     */
    applyOperationToPlate: function( operation ) {
      throw new Error( 'createTermOnPlateForOperation is not supported by MysteryTermCreator' );
    },

    /**
     * Is this term creator the inverse of a specified term creator?
     * @param {TermCreator} termCreator
     * @returns {boolean}
     * @public
     * @override
     */
    isInverseOf: function( termCreator ) {
      return false; // there are no inverses for mystery objects
    },

    /**
     * Is this term creator equivalent to a specified term creator?
     * @param {TermCreator} termCreator
     * @returns {boolean}
     * @public
     * @override
     */
    isEquivalentTo: function( termCreator ) {
      return false; // there are no equivalents for mystery objects
    }
  } );
} );
 