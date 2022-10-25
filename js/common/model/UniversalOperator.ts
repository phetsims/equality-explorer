// Copyright 2022, University of Colorado Boulder

/**
 * UniversalOperator is a rich enumeration for operators that are supported by a UniversalOperation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import dotRandom from '../../../../dot/js/dotRandom.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';

export default class UniversalOperator extends EnumerationValue {

  // In the order that they appear in the ObjectPicker for the UniversalOperationControl
  public static readonly PLUS = new UniversalOperator( MathSymbols.PLUS, 'plus' );
  public static readonly MINUS = new UniversalOperator( MathSymbols.MINUS, 'minus' );
  public static readonly TIMES = new UniversalOperator( MathSymbols.TIMES, 'times' );
  public static readonly DIVIDE = new UniversalOperator( MathSymbols.DIVIDE, 'divide' );

  public static readonly enumeration = new Enumeration( UniversalOperator );

  // The mathematical symbol for the operator
  public readonly symbol: string;

  // The tandem name for the operator, used as the prefix for related tandems
  public readonly tandemName: string;

  public constructor( symbol: string, tandemName: string ) {
    super();
    this.symbol = symbol;
    this.tandemName = tandemName;
  }

  /**
   * Chooses a random operator.
   */
  public static getRandom(): UniversalOperator {
    return dotRandom.sample( [ ...UniversalOperator.enumeration.values ] );
  }
}