// Copyright 2018-2022, University of Colorado Boulder

/**
 * Data structure that describes a 'universal operation', a term specific to this sim,
 * an operation that will be applied to both sides of the equation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import equalityExplorer from '../../equalityExplorer.js';
import ConstantTerm from './ConstantTerm.js';
import VariableTerm from './VariableTerm.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import dotRandom from '../../../../dot/js/dotRandom.js';

// universal operators, in the order that they appear in the operator picker
export const UniversalOperatorValues = [ MathSymbols.PLUS, MathSymbols.MINUS, MathSymbols.TIMES, MathSymbols.DIVIDE ] as const;
export type UniversalOperator = ( typeof UniversalOperatorValues )[number];

// universal operand can be either a constant or a variable term
export type UniversalOperand = ConstantTerm | VariableTerm;

export default class UniversalOperation {

  public readonly operator: UniversalOperator;
  public readonly operand: UniversalOperand;

  public constructor( operator: UniversalOperator, operand: UniversalOperand ) {
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

  /**
   * Chooses a random operator.
   */
  public static randomOperator(): UniversalOperator {
    return dotRandom.sample( [ ...UniversalOperatorValues ] );
  }
}

equalityExplorer.register( 'UniversalOperation', UniversalOperation );