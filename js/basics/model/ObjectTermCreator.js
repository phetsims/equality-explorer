// Copyright 2017-2018, University of Colorado Boulder

/**
 * ObjectTermCreator creates and manages terms that are associated with object types (apple, dog, turtle,...)
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ObjectTerm = require( 'EQUALITY_EXPLORER/basics/model/ObjectTerm' );
  var ObjectTermNode = require( 'EQUALITY_EXPLORER/basics/view/ObjectTermNode' );
  var TermCreator = require( 'EQUALITY_EXPLORER/common/model/TermCreator' );

  /**
   * @param {ObjectType} objectType
   * @param {Object} [options]
   * @constructor
   */
  function ObjectTermCreator( objectType, options ) {

    var self = this;

    phet.log && phet.log( 'ObjectTermCreator: ' + objectType.debugName +
                          ', weight=' + objectType.weightProperty.value );

    // @public (read-only)
    this.objectType = objectType;

    TermCreator.call( this, options );

    // When the object type's weight changes, recompute the weight of terms on the scale.
    // unlink not needed.
    this.objectType.weightProperty.link( function( weight ) {
      self.updateWeightOnPlateProperty();
    } );
  }

  equalityExplorer.register( 'ObjectTermCreator', ObjectTermCreator );

  return inherit( TermCreator, ObjectTermCreator, {

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
      return ObjectTermNode.createInteractiveTermNode( this.objectType.image );
    },

    /**
     * Instantiates a ObjectTerm.
     * @param {Object} [options]
     * @returns {Term}
     * @protected
     * @override
     */
    createTermProtected: function( options ) {
      return new ObjectTerm( this.objectType, options );
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
      throw new Error( 'createZeroTerm is not supported for ObjectTermCreator' );
    },

    /**
     * Instantiates the Node that corresponds to this term.
     * @param {Term} term
     * @param {Object} options - passed to the ObjectTermNode's constructor
     * @returns {TermNode}
     * @public
     * @override
     */
    createTermNode: function( term, options ) {
      return new ObjectTermNode( this, term, options );
    }
  } );
} );
 