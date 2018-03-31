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

    TermCreator.call( this, options );
  }

  equalityExplorer.register( 'MysteryTermCreator', MysteryTermCreator );

  return inherit( TermCreator, MysteryTermCreator, {

    //-------------------------------------------------------------------------------------------------
    // Below here is the implementation of the TermCreator API
    //-------------------------------------------------------------------------------------------------

    /**
     * Creates the icon used to represent this term in the TermsToolbox and equations.
     * @param {Object} [options] - ignored for this subtype
     * @returns {Node}
     * @public
     * @override
     */
    createIcon: function( options ) {
      return MysteryTermNode.createInteractiveTermNode( this.mysteryObject.image );
    },

    /**
     * Instantiates a MysteryTerm.
     * @param {Object} [options]
     * @returns {Term}
     * @protected
     * @override
     */
    createTermProtected: function( options ) {

      options = options || {};
      
      // Set this way so we don't access positiveLocation before it has been initialized
      if ( !options.location ) {
        options.location  = this.positiveLocation; // all mystery terms are positive
      }

      return new MysteryTerm( this.mysteryObject, options );
    },

    /**
     * Instantiates the Node that corresponds to this term.
     * @param {Term} term
     * @param {Object} options - passed to the MysteryTermNode's constructor
     * @returns {TermNode}
     * @public
     * @override
     */
    createTermNode: function( term, options ) {
      return new MysteryTermNode( this, term, this.plate, options );
    },

    //-------------------------------------------------------------------------------------------------
    // Below here are parts of the TermCreator API that are not supported for mystery terms.
    // These are all related to universal operations, which are not applicable to mystery terms.
    //-------------------------------------------------------------------------------------------------

    // @public @override see TermCreator
    combineTerms: function( term1, term2, options ) {
      throw new Error( 'combineTerms is not supported by MysteryTermCreator' );
    },

    // @public @override see TermCreator
    copyTerm: function( term, options ) {
      throw new Error( 'copyTerm is not supported by MysteryTermCreator' );
    },

    // @public @override see TermCreator
    applyOperation: function( operation ) {
      throw new Error( 'applyOperation is not supported by MysteryTermCreator' );
    }
  } );
} );
 