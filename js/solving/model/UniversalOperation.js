// Copyright 2018, University of Colorado Boulder

/**
 * A universal operation, which can be applied to a set of terms.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {string} operator
   * @param {number} operand
   * @constructor
   */
  function UniversalOperation( operator, operand ) {

    // @private
    this.operator = operator;
    this.operand = operand;
  }

  equalityExplorer.register( 'UniversalOperation', UniversalOperation );

  return inherit( Object, UniversalOperation, {

    /**
     * Applies the operation to terms.
     * @param {*[]} terms
     * @public
     */
    applyTo: function( terms ) {
      for ( var i = 0; i < terms.length; i++ ) {
        terms[ i ].apply( this );
      }
    }
  } );
} );
