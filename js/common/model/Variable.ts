// Copyright 2018-2022, University of Colorado Boulder

/**
 * Model of a variable, e.g. 'x', used in variable terms.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import equalityExplorer from '../../equalityExplorer.js';
import optionize from '../../../../phet-core/js/optionize.js';

type SelfOptions = {
  value?: number; // initial value
  range?: Range | null; // range of the value, null means unbounded
};

export type VariableOptions = SelfOptions;

export default class Variable {

  public readonly symbol: string;
  public readonly range: Range | null;
  public readonly valueProperty: NumberProperty; // the value of the variable

  /**
   * @param symbol - the variable's symbol, e.g. 'x'
   * @param [providedOptions]
   */
  public constructor( symbol: string, providedOptions?: VariableOptions ) {

    const options = optionize<VariableOptions, SelfOptions>()( {

      // SelfOptions
      value: 1,
      range: null
    }, providedOptions );

    assert && assert( !options.range || options.range.contains( options.value ),
      `value ${options.value} is not in range ${options.range}` );

    this.symbol = symbol;
    this.range = options.range;

    this.valueProperty = new NumberProperty( options.value, {
      numberType: 'Integer',
      range: this.range
    } );
  }

  public reset(): void {
    this.valueProperty.reset();
  }

  /**
   * For debugging only. Do not rely on the format of toString.
   */
  public toString(): string {
    return `Variable: ${this.symbol}=${this.valueProperty.value}`;
  }
}

equalityExplorer.register( 'Variable', Variable );