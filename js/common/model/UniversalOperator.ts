// Copyright 2022, University of Colorado Boulder

/**
 * Type for universal operator.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';

// universal operators, in the order that they appear in the operator picker
export const UniversalOperatorValues = [ MathSymbols.PLUS, MathSymbols.MINUS, MathSymbols.TIMES, MathSymbols.DIVIDE ] as const;

export type UniversalOperator = ( typeof UniversalOperatorValues )[number];