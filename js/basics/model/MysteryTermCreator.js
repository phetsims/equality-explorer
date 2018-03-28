// Copyright 2017-2018, University of Colorado Boulder

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

    var icon = MysteryTermNode.createInteractiveTermNode( mysteryObject.image );

    TermCreator.call( this, icon, options );
  }

  equalityExplorer.register( 'MysteryTermCreator', MysteryTermCreator );

  return inherit( TermCreator, MysteryTermCreator, {

    /**
     * Instantiates a MysteryTerm.
     * @param {Object} [options] - passed to the MysteryTerm's constructor
     * @returns {Term}
     * @protected
     * @override
     */
    createTermProtected: function( options ) {
      return new MysteryTerm( this.mysteryObject, this, options );
    },

    /**
     * Instantiates the Node that corresponds to this term.
     * @param {Term} term
     * @param {Plate} plate
     * @param {Object} options - passed to the MysteryTermNode's constructor
     * @returns {TermNode}
     * @public
     * @override
     */
    createTermNode: function( term, plate, options ) {
      return new MysteryTermNode( this, term, plate, options );
    },

    /**
     * Applies a universal operation to a term on the plate.
     * @param {UniversalOperation} operation
     * @param {Term} term
     * @returns {Term|null} the new term, null if the the operation resulted in zero
     * @public
     * @override
     */
    applyOperationToTerm: function( operation, term ) {
      return term; // operations do not apply to mystery terms
    },

    /**
     * Applies a universal operation to the plate.
     * @param {UniversalOperation} operation
     * @returns {Term|null} the term created, null if no term was created
     * @public
     * @override
     */
    applyOperationToPlate: function( operation ) {
      return null; // operations do not apply to mystery terms
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
    },

    /**
     * Creates a lightweight data structure that describes the terms on the plate for this TermCreator.
     * The format of this data structure is specific MysteryTermCreator.
     * @returns {{cellIndex: number}[]}
     * @public
     * @override
     */
    createSnapshot: function() {
      var snapshot = [];
      var termsOnPlate = this.getTermsOnPlate();
      for ( var i = 0; i < termsOnPlate.length; i++ ) {
        var term = termsOnPlate[ i ];
        assert && assert( term instanceof MysteryTerm, 'invalid term: ' + term );
        snapshot.push( { cellIndex: this.plate.getCellForTerm( term ) } );
      }
      return snapshot;
    },

    /**
     * Restores a snapshot of terms on the plate for this TermCreator.
     * @param {*} snapshot - see return value of createSnapshot
     * @public
     * @override
     */
    restoreSnapshot: function( snapshot ) {
      for ( var i = 0; i < snapshot.length; i++ ) {
        this.createTermOnPlate( snapshot[ i ].cellIndex );
      }
    },

    //-------------------------------------------------------------------------------------------------
    // Below here are parts of the TermCreator API that are not supported for mystery terms
    //-------------------------------------------------------------------------------------------------

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
     * @public
     * @override
     */
    copyTerm: function( term, options ) {
      throw new Error( 'copyTerm is not supported by MysteryTermCreator' );
    }
  } );
} );
 