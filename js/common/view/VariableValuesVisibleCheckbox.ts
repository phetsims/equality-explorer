// Copyright 2017-2023, University of Colorado Boulder

/**
 * Checkbox used to show/hide the values of variables in the Snapshots accordion box.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerStrings from '../../EqualityExplorerStrings.js';
import Variable from '../model/Variable.js';
import VariableNode from './VariableNode.js';

// constants
const FONT_SIZE = 24;

type SelfOptions = EmptySelfOptions;

type VariableValuesVisibleCheckboxOptions = SelfOptions & CheckboxOptions & PickRequired<CheckboxOptions, 'tandem'>;

export default class VariableValuesVisibleCheckbox extends Checkbox {

  public constructor( variableValueVisibleProperty: Property<boolean>, variables: Variable[],
                      providedOptions?: VariableValuesVisibleCheckboxOptions ) {

    const options = optionize<VariableValuesVisibleCheckboxOptions, SelfOptions, CheckboxOptions>()( {

      // CheckboxOptions
      isDisposable: false
    }, providedOptions );

    // Design decision: If there are multiple variables, use the first variable to label the checkbox.
    // This decision was based on the limited space we have for the checkbox in Snapshots accordion box.
    const variable = variables[ 0 ];

    // variable
    const variableNode = new VariableNode( variable, {
      iconScale: 0.45,
      fontSize: FONT_SIZE
    } );

    // ' = ?'
    const rightStringProperty = new DerivedProperty(
      [ EqualityExplorerStrings.questionMarkStringProperty ],
      questionMarkString => ` ${MathSymbols.EQUAL_TO} ${questionMarkString}` );

    const rightText = new Text( rightStringProperty, {
      font: new PhetFont( FONT_SIZE )
    } );

    const contentNode = new HBox( {
      children: [ variableNode, rightText ], // x = ?
      maxWidth: 100
    } );

    super( variableValueVisibleProperty, contentNode, options );
  }
}

equalityExplorer.register( 'VariableValuesVisibleCheckbox', VariableValuesVisibleCheckbox );