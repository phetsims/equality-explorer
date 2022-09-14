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
import Term from './Term.js';
import VariableTerm from './VariableTerm.js';

export default class UniversalOperation {

  public readonly operator: string; //TODO https://github.com/phetsims/equality-explorer/issues/186 create a rich enum for operator
  public readonly operand: Term;

  public constructor( operator: string, operand: Term ) {

    assert && assert( _.includes( EqualityExplorerConstants.OPERATORS, operator ),
      `invalid operator: ${operator}` );
    assert && assert( operand instanceof ConstantTerm || operand instanceof VariableTerm,
      `invalid operand: ${operand}` );

    this.operator = operator;
    this.operand = operand;
  }

  /**
   * For debugging only. Do not rely on the format of toString.
   */
  public toString(): string {
    return `operator=${this.operator}, operand=${this.operand}`;
  }

  /**
   * Creates a concise human-readable string representation, intended to be used for phet.log calls.
   */
  public toLogString(): string {
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