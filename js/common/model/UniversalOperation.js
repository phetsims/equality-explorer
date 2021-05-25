// Copyright 2018-2021, University of Colorado Boulder

/**
 * Data structure that describes a 'universal operation', a term specific to this sim,
 * an operation that will be applied to both sides of the equation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerConstants from '../EqualityExplorerConstants.js';
import ConstantTerm from './ConstantTerm.js';
import VariableTerm from './VariableTerm.js';

class UniversalOperation {

  /**
   * @param {string} operator - see EqualityExplorerConstants.OPERATORS
   * @param {Term} operand
   */
  constructor( operator, operand ) {

    assert && assert( _.includes( EqualityExplorerConstants.OPERATORS, operator ),
      `invalid operator: ${operator}` );
    assert && assert( operand instanceof ConstantTerm || operand instanceof VariableTerm,
      `invalid operand: ${operand}` );

    // @public (read-only)
    this.operator = operator;
    this.operand = operand;
  }

  /**
   * For debugging only. Do not rely on the format of toString.
   * @returns {string}
   * @public
   */
  toString() {
    return `operator=${this.operator}, operand=${this.operand}`;
  }

  /**
   * Creates a concise human-readable string representation, intended to be used for phet.log calls.
   * @returns {string}
   * @public (debug)
   */
  toLogString() {
    if ( this.operand instanceof ConstantTerm ) {

      // e.g. '+ 2'
      return StringUtils.fillIn( '{{operator}} {{constantValue}}', {
        operator: this.operator,
        constantValue: this.operand.constantValue.getValue()
      } );
    }
    else if ( this.operand instanceof VariableTerm ) {

      // e.g. '+ 2x (x=6)'
      return StringUtils.fillIn( '{{operator}} {{coefficient}}{{symbol}} ({{symbol}}={{variableValue}})', {
        operator: this.operator,
        coefficient: this.operand.coefficient.getValue(),
        symbol: this.operand.variable.symbol,
        variableValue: this.operand.variable.valueProperty.value
      } );
    }
    else {
      throw new Error( `unsupported operand: ${this.operand}` );
    }
  }
}

equalityExplorer.register( 'UniversalOperation', UniversalOperation );

export default UniversalOperation;