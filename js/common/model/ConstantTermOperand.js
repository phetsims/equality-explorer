// Copyright 2018, University of Colorado Boulder

/**
 * Data structure for a constant term operand in a universal operation.
 * There's not much to this data structure. It's a type solely for differentiation with VariableTermOperand.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {number} constantValue
   * @constructor
   */
  function ConstantTermOperand( constantValue ) {

    // @public (read-only)
    this.constantValue = constantValue;
  }

  equalityExplorer.register( 'ConstantTermOperand', ConstantTermOperand );

  return inherit( Object, ConstantTermOperand );
} );