// Copyright 2018, University of Colorado Boulder

/**
 * Model of an equation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ReducedFraction = require( 'EQUALITY_EXPLORER/common/model/ReducedFraction' );

  /**
   * @param {Term[]} leftTerms - terms on left side of the equation
   * @param {Term[]} rightTerms - terms on right side of the equation
   * @constructor
   */
  function Equation( leftTerms, rightTerms ) {

    // @public (read-only)
    this.leftTerms = leftTerms;
    this.rightTerms = rightTerms;
  }

  equalityExplorer.register( 'Equation', Equation );

  /**
   * Gets the weight of a set of terms.
   * @param {Term[]} terms
   * @returns {ReducedFraction}
   */
  function getWeightOfTerms( terms ) {
    var weight = ReducedFraction.ZERO;
    for ( var i = 0; i < terms.length; i++ ) {
      weight = weight.plus( terms[ i ].weightProperty.value );
    }
    return weight;
  }

  return inherit( Object, Equation, {

    /**
     * Gets the total weight of the left side of the equation.
     * @returns {ReducedFraction}
     * @public
     */
    getLeftWeight: function() {
      return getWeightOfTerms( this.leftTerms );
    },

    /**
     * Gets the total weight of the right side of the equation.
     * @returns {ReducedFraction}
     * @public
     */
    getRightWeight: function() {
      return getWeightOfTerms( this.rightTerms );
    },

    /**
     * Gets the relational operator that describes the current state of the equation.
     * @returns {string}
     * @public
     */
    getRelationalOperator: function() {

      var leftWeight = this.getLeftWeight();
      var rightWeight = this.getRightWeight();

      var relationalOperator = null;
      if ( leftWeight < rightWeight ) {
        relationalOperator = EqualityExplorerConstants.LESS_THAN;
      }
      else if ( leftWeight > rightWeight ) {
        relationalOperator = EqualityExplorerConstants.GREATER_THAN;
      }
      else {
        relationalOperator = EqualityExplorerConstants.EQUALS;
      }

      return relationalOperator;
    }
  } );
} );
