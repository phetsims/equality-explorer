// Copyright 2018-2021, University of Colorado Boulder

/**
 * Model of a variable, e.g. 'x', used in variable terms.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import equalityExplorer from '../../equalityExplorer.js';

class Variable {

  /**
   * @param {string} symbol - the variable's symbol, e.g. 'x'
   * @param {Object} [options]
   */
  constructor( symbol, options ) {

    options = merge( {
      value: 1, // the initial value
      range: null // {Range|null} range of the value, null means unbounded
    }, options );

    assert && assert( !options.range || options.range.contains( options.value ),
      `value ${options.value} is not in range ${options.range}` );

    // @public (read-only)
    this.symbol = symbol;

    // @public (read-only)
    this.range = options.range;

    // @public the value of the variable
    this.valueProperty = new NumberProperty( options.value, {
      numberType: 'Integer',
      range: this.range
    } );
  }

  // @public
  reset() {
    this.valueProperty.reset();
  }

  /**
   * For debugging only. Do not rely on the format of toString.
   * @returns {string}
   * @public
   */
  toString() {
    return `Variable: ${this.symbol}=${this.valueProperty.value}`;
  }
}

equalityExplorer.register( 'Variable', Variable );

export default Variable;