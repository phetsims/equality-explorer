// Copyright 2022, University of Colorado Boulder

/**
 * String union that defines the set of relational operators.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';

export const RelationalOperatorValues = [ MathSymbols.LESS_THAN, MathSymbols.EQUAL_TO, MathSymbols.GREATER_THAN ] as const;
export type RelationalOperator = ( typeof RelationalOperatorValues )[number];