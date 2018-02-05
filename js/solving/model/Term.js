// Copyright 2018, University of Colorado Boulder

/**
 * Base type for terms.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var EqualityExplorerMovable = require( 'EQUALITY_EXPLORER/common/model/EqualityExplorerMovable' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var ReducedFraction = require( 'EQUALITY_EXPLORER/common/model/ReducedFraction' );

  /**
   * @param {AbstractItemCreator} positiveItemCreator
   * @param {AbstractItemCreator} negativeItemCreator
   * @param {function} createWeightProperty - creates a DerivedProperty whose value is the weight of this term
   * @param {Object} [options]
   * @constructor
   */
  function Term( positiveItemCreator, negativeItemCreator, createWeightProperty, options ) {

    options = _.extend( {
      numberOfItems: ReducedFraction.ZERO // {ReducedFraction} initial number of items
    }, options );

    // @public (read-only)
    this.positiveItemCreator = positiveItemCreator;
    this.negativeItemCreator = negativeItemCreator;

    // @public {Property.<ReducedFraction>} number of items that make up this term
    this.numberOfItemsProperty = new Property( options.numberOfItems );

    // @public (read-only) {DerivedProperty.<ReducedFraction>} weight of the term
    this.weightProperty = createWeightProperty( this.numberOfItemsProperty );

    EqualityExplorerMovable.call( this, options );
  }

  equalityExplorer.register( 'Term', Term );

  return inherit( EqualityExplorerMovable, Term, {

    /**
     * @public
     * @override
     */
    reset: function() {
      this.numberOfItemsProperty.reset();
      EqualityExplorerMovable.prototype.reset.call( this );
    },

    /**
     * Multiplies the number of items by an integer value.
     * @param {number} value
     * @public
     */
    times: function( value ) {
      this.numberOfItemsProperty.value = this.numberOfItemsProperty.value.times( value );
    },

    /**
     * Divides the number of items by an integer value.
     * @param {number} value
     * @public
     */
    divide: function( value ) {
      this.numberOfItemsProperty.value = this.numberOfItemsProperty.value.divide( value );
    },

    /**
     * Applies a universal operation to this term.
     * If this term does not support the operator, the operation is ignored.
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
        this.times( operation.operand );
      }
      else if ( operation.operator === EqualityExplorerConstants.DIVIDE ) {
        this.divide( operation.operand );
      }
      else {
        throw new Error( 'invalid operator: ' + operation.operator );
      }
    }
  } );
} );