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
  var Util = require( 'DOT/Util' );

  /**
   * @param {string} operator
   * @param {number} operand
   * @constructor
   */
  function UniversalOperation( operator, operand ) {

    assert && assert( _.includes( EqualityExplorerConstants.OPERATORS, operator ),
      'invalid operator: ' + operator );
    assert && assert( Util.isInteger( operand ),
      'operand must be an integer: ' + operand );

    // @public (read-only)
    this.operator = operator;
    this.operand = operand;
  }

  equalityExplorer.register( 'UniversalOperation', UniversalOperation );

  return inherit( Object, UniversalOperation );
} );
