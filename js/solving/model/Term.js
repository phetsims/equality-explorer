// Copyright 2018, University of Colorado Boulder

/**
 * Abstract base type for terms on the scale.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {AbstractItemCreator} positiveItemCreator
   * @param {AbstractItemCreator} negativeItemCreator
   * @constructor
   */
  function Term( positiveItemCreator, negativeItemCreator ) {

    // @public (read-only)
    this.positiveItemCreator = positiveItemCreator;
    this.negativeItemCreator = negativeItemCreator;
  }

  equalityExplorer.register( 'Term', Term );

  return inherit( Object, Term, {

    /**
     * Functions for the operations that a term may support.
     * Subtypes provide implementations for the operations that are relevant to them.
     * Unimplemented operations will be ignored.
     * @public
     */
    plus: null,
    minus: null,
    times: null,
    divide: null,

    /**
     * Applies a universal operation to this term.
     * If this term does not support the operator, the operation is ignored.
     *
     * @param {UniversalOperation} operation
     * @public
     */
    apply: function( operation ) {
      if ( operation.operator === EqualityExplorerConstants.PLUS ) {
        this.plus && this.plus( operation.operand );
      }
      else if ( operation.operator === EqualityExplorerConstants.MINUS ) {
        this.minus && this.minus( operation.operand );
      }
      else if ( operation.operator === EqualityExplorerConstants.TIMES ) {
        this.times && this.times( operation.operand );
      }
      else if ( operation.operator === EqualityExplorerConstants.DIVIDE ) {
        this.divide && this.divide( operation.operand );
      }
      else {
        throw new Error( 'invalid operator: ' + operation.operator );
      }
    },

    /**
     * Gets the value of this term.
     * @returns {number}
     * @abstract
     * @public
     */
    getValue: function() {
      throw new Error( 'must be implemented by subtype' );
    },
    get value() { return this.getValue(); }
  } );
} );