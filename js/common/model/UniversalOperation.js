// Copyright 2018, University of Colorado Boulder

/**
 * Data structure that describes a universal operation.
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
   * @param {string} operator
   * @param {Object} operand
   * @constructor
   */
  function UniversalOperation( operator, operand ) {

    assert && assert( _.includes( EqualityExplorerConstants.OPERATORS, operator ),
      'invalid operator: ' + operator );

    // @public (read-only)
    this.operator = operator;
    this.operand = operand;
  }

  equalityExplorer.register( 'UniversalOperation', UniversalOperation );

  return inherit( Object, UniversalOperation, {}, {

    //TODO this approach leans too heavily on duck typing for processing these data structures
    /**
     * Creates a data structure that describes a constant term operand.
     * @param {number} constantValue
     * @returns {{constantValue: number}}
     * @public
     * @static
     */
    createConstantTermOperand: function( constantValue ) {
      return { constantValue: constantValue };
    },

    /**
     * Creates a data structure that describes a variable term operand.
     * @param {number} coefficient
     * @param {string} symbol
     * @returns {{coefficient: number, symbol: string}}
     * @public
     * @static
     */
    createVariableTermOperand: function( coefficient, symbol ) {
      return { coefficient: coefficient, symbol: symbol };
    }
  } );
} );
