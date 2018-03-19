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

  return inherit( Object, UniversalOperation );
} );
