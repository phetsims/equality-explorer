// Copyright 2022, University of Colorado Boulder

/**
 * Type for universal operand.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ConstantTerm from './ConstantTerm.js';
import VariableTerm from './VariableTerm.js';

export type UniversalOperand = ConstantTerm | VariableTerm;