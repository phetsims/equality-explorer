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
      return new MysteryTerm( this.mysteryObject, options );
    },

    /**
     * Creates a term whose significant value is zero. This is used when applying an operation to an empty plate.
     * The term is not managed by the TermCreator.
     * @param {Object} [options] - Term constructor options
     * @returns {Term}
     * @public
     * @abstract
     */
    createZeroTerm: function( options ) {
      throw new Error( 'createZeroTerm is not supported for MysteryTermCreator' );
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
    }
  } );
} );
 