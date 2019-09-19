// Copyright 2018, University of Colorado Boulder

/**
 * Model of a variable, e.g. 'x', used in variable terms.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const inherit = require( 'PHET_CORE/inherit' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Range = require( 'DOT/Range' );

  // constants
  var DEFAULT_RANGE = new Range( -40, 40 );

  /**
   * @param {string} symbol - the variable's symbol, e.g. 'x'
   * @param {Object} [options]
   * @constructor
   */
  function Variable( symbol, options ) {

    options = _.extend( {
      value: 1, // the initial value
      range: DEFAULT_RANGE // range of the value
    }, options );

    // @public (read-only)
    this.symbol = symbol;

    // @public (read-only)
    this.range = options.range;

    // @public the value of the variable
    this.valueProperty = new NumberProperty( options.value, {
      numberType: 'Integer',
      range: this.xRange
    } );
  }

  equalityExplorer.register( 'Variable', Variable );

  return inherit( Object, Variable, {

    // @public
    reset: function() {
      this.valueProperty.reset();
    },

    /**
     * For debugging only. Do not rely on the format of toString.
     * @returns {string}
     * @public
     */
    toString: function() {
      return 'Variable: ' + this.symbol + '=' + this.valueProperty.value;
    }
  } );
} );