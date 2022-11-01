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
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import LinkableProperty from '../../../../axon/js/LinkableProperty.js';
import EqualityExplorerConstants from '../EqualityExplorerConstants.js';
import Tandem from '../../../../tandem/js/Tandem.js';

type SelfOptions = {
  value?: number; // initial value
  range?: Range | null; // range of the value, null means unbounded
};

export type VariableOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class Variable extends PhetioObject {

  public readonly symbolProperty: TReadOnlyProperty<string>;
  public readonly range: Range | null;
  public readonly valueProperty: NumberProperty; // the value of the variable

  /**
   * @param symbolProperty - the variable's symbol, e.g. 'x'
   * @param [providedOptions]
   */
  public constructor( symbolProperty: LinkableProperty<string>, providedOptions: VariableOptions ) {

    const options = optionize<VariableOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      value: 1,
      range: EqualityExplorerConstants.VARIABLE_RANGE,

      // PhetioObjectOptions
      phetioState: false
    }, providedOptions );

    assert && assert( !options.range || options.range.contains( options.value ),
      `value ${options.value} is not in range ${options.range}` );

    super( options );

    this.symbolProperty = symbolProperty;
    this.range = options.range;

    this.valueProperty = new NumberProperty( options.value, {
      numberType: 'Integer',
      range: options.range,
      tandem: options.tandem.createTandem( 'valueProperty' ),

      // If no range was provided, then do not allow the value to be changed.
      // This is important in the 'Solve It' screen, where the game challenges are responsible for the variable value.
      phetioReadOnly: ( options.range === null ),

      // Do not instrument rangeProperty when there is no range. See https://github.com/phetsims/axon/issues/423
      rangePropertyOptions: ( options.range === null ) ? { tandem: Tandem.OPT_OUT } : {}
    } );

    this.addLinkedElement( symbolProperty, {
      tandem: options.tandem.createTandem( 'symbolProperty' )
    } );
  }

  public reset(): void {
    this.valueProperty.reset();
  }

  /**
   * For debugging only. Do not rely on the format of toString.
   */
  public override toString(): string {
    return `Variable: symbol=${this.symbolProperty.value} value=${this.valueProperty.value}`;
  }
}

equalityExplorer.register( 'Variable', Variable );