// Copyright 2018, University of Colorado Boulder

/**
 * Data structure that describes a 'universal operation', a term specific to this sim,
 * an operation that will be applied to both sides of the equation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ConstantTerm = require( 'EQUALITY_EXPLORER/common/model/ConstantTerm' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var VariableTerm = require( 'EQUALITY_EXPLORER/common/model/VariableTerm' );

  /**
   * @param {string} operator - see EqualityExplorerConstants.OPERATORS
   * @param {Term} operand
   * @constructor
   */
  function UniversalOperation( operator, operand ) {

    assert && assert( _.includes( EqualityExplorerConstants.OPERATORS, operator ),
      'invalid operator: ' + operator );
    assert && assert( operand instanceof ConstantTerm || operand instanceof VariableTerm,
      'invalid operand: ' + operand );

    // @public (read-only)
    this.operator = operator;
    this.operand = operand;
  }

  equalityExplorer.register( 'UniversalOperation', UniversalOperation );

  return inherit( Object, UniversalOperation, {

    // @public do not rely on the format!
    toString: function() {
      return 'operator=' + this.operator + ', operand=' + this.operand;
    }
  } );
} );
