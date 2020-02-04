// Copyright 2017-2020, University of Colorado Boulder

/**
 * ObjectTermCreator creates and manages terms that are associated with real-world objects.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const inherit = require( 'PHET_CORE/inherit' );
  const ObjectTerm = require( 'EQUALITY_EXPLORER/basics/model/ObjectTerm' );
  const ObjectTermNode = require( 'EQUALITY_EXPLORER/basics/view/ObjectTermNode' );
  const TermCreator = require( 'EQUALITY_EXPLORER/common/model/TermCreator' );

  /**
   * @param {ObjectVariable} variable
   * @param {Object} [options]
   * @constructor
   */
  function ObjectTermCreator( variable, options ) {

    const self = this;

    phet.log && phet.log( 'ObjectTermCreator: ' + variable.symbol + ', weight=' + variable.valueProperty.value );

    // @public (read-only)
    this.variable = variable;

    TermCreator.call( this, options );

    // When the variable's value changes, recompute the weight of terms on the scale. unlink not needed.
    this.variable.valueProperty.link( function( value ) {
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
     * @param {Object} [options]
     * @returns {Node}
     * @public
     * @override
     */
    createIcon: function( options ) {
      return ObjectTermNode.createInteractiveTermNode( this.variable.image, options );
    },

    /**
     * Instantiates a ObjectTerm.
     * @param {Object} [options]
     * @returns {Term}
     * @protected
     * @override
     */
    createTermProtected: function( options ) {
      return new ObjectTerm( this.variable, options );
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
     * @param {Object} [options] - passed to the ObjectTermNode's constructor
     * @returns {TermNode}
     * @public
     * @override
     */
    createTermNode: function( term, options ) {
      return new ObjectTermNode( this, term, options );
    }
  } );
} );
 