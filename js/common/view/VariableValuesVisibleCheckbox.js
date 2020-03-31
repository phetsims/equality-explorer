// Copyright 2017-2020, University of Colorado Boulder

/**
 * Checkbox used to show/hide the values of variables in the Snapshots accordion box.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import equalityExplorerStrings from '../../equalityExplorerStrings.js';
import equalityExplorer from '../../equalityExplorer.js';
import VariableNode from './VariableNode.js';

const questionMarkString = equalityExplorerStrings.questionMark;

// constants
const FONT_SIZE = 24;

class VariableValuesVisibleCheckbox extends Checkbox {

  /**
   * @param {Variable[]} variables - the variables
   * @param {BooleanProperty} variableValueVisibleProperty - whether the variable value is visible
   * @param {Object} [options]
   */
  constructor( variables, variableValueVisibleProperty, options ) {

    // Design decision: If there are multiple variables, use the first variable to label the checkbox.
    // This decision was based on the limited space we have for the checkbox in Snapshots accordion box.
    const variable = variables[ 0 ];

    // variable
    const variableNode = new VariableNode( variable, {
      iconScale: 0.45,
      fontSize: FONT_SIZE
    } );

    // '= ?' in normal font (no i18n requirements here, since this is an equation)
    const rightNode = new Text( ' ' + MathSymbols.EQUAL_TO + ' ' + questionMarkString, {
      font: new PhetFont( FONT_SIZE )
    } );

    const contentNode = new HBox( {
      children: [ variableNode, rightNode ], // x = ?
      maxWidth: 100
    } );

    super( contentNode, variableValueVisibleProperty, options );
  }
}

equalityExplorer.register( 'VariableValuesVisibleCheckbox', VariableValuesVisibleCheckbox );

export default VariableValuesVisibleCheckbox;