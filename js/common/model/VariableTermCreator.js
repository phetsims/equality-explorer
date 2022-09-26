// Copyright 2017-2022, University of Colorado Boulder

/**
 * VariableTermCreator creates and manages variable terms (e.g. 'x').
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerColors from '../EqualityExplorerColors.js';
import EqualityExplorerConstants from '../EqualityExplorerConstants.js';
import VariableTermNode from '../view/VariableTermNode.js';
import TermCreator from './TermCreator.js';
import VariableTerm from './VariableTerm.js';

export default class VariableTermCreator extends TermCreator {

  /**
   * @param {Variable} variable
   * @param {Object} [options]
   */
  constructor( variable, options ) {

    options = merge( {
      variable: variable,
      positiveFill: EqualityExplorerColors.POSITIVE_X_FILL, // fill for the background of positive terms
      negativeFill: EqualityExplorerColors.NEGATIVE_X_FILL  // fill for the background of negative terms
    }, options );

    super( options );

    // @private
    this.positiveFill = options.positiveFill;
    this.negativeFill = options.negativeFill;

    // When the variable values changes, recompute the weight of terms on the scale. unlink not needed.
    this.variable.valueProperty.link( variableValue => this.updateWeightOnPlateProperty() );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Returns the sum of coefficients for all terms on the plate.
   * @returns {Fraction}
   * @public
   */
  sumCoefficientsOnPlate() {
    let sum = Fraction.fromInteger( 0 );
    for ( let i = 0; i < this.termsOnPlate.length; i++ ) {
      sum = sum.plus( this.termsOnPlate.get( i ).coefficient ).reduced();
    }
    return sum;
  }

  //-------------------------------------------------------------------------------------------------
  // Below here is the implementation of the TermCreator API
  //-------------------------------------------------------------------------------------------------

  /**
   * Creates the icon used to represent this term in the TermsToolbox and equations.
   * @param {Object} [options]
   * @returns {Node}
   * @public
   * @override
   */
  createIcon( options ) {

    options = merge( {
      sign: 1  // sign of the coefficient shown on the icon, 1 or -1
    }, options );
    assert && assert( options.sign === 1 || options.sign === -1, `invalid sign: ${options.sign}` );

    const coefficient = EqualityExplorerConstants.DEFAULT_COEFFICIENT.timesInteger( options.sign );
    return VariableTermNode.createInteractiveTermNode( coefficient, this.variable.symbolProperty, {
      positiveFill: this.positiveFill,
      negativeFill: this.negativeFill
    } );
  }

  /**
   * Instantiates a VariableTerm.
   * @param {Object} [options] - passed to the VariableTerm's constructor
   * @returns {Term}
   * @protected
   * @override
   */
  createTermProtected( options ) {

    options = merge( {
      sign: 1
    }, options );
    assert && assert( options.sign === 1 || options.sign === -1, `invalid sign: ${options.sign}` );

    // If the coefficient wasn't specified, use the default.
    options.coefficient = options.coefficient || EqualityExplorerConstants.DEFAULT_COEFFICIENT;

    // Adjust the sign
    options.coefficient = options.coefficient.timesInteger( options.sign );

    return new VariableTerm( this.variable, options );
  }

  /**
   * Creates a term whose significant value is zero. This is used when applying an operation to an empty plate.
   * The term is not managed by the TermCreator.
   * @param {Object} [options] - VariableTerm options
   * @returns {Term}
   * @public
   * @override
   */
  createZeroTerm( options ) {
    options = options || {};
    assert && assert( !options.coefficient, 'VariableTermCreator sets coefficient' );
    options.coefficient = Fraction.fromInteger( 0 );
    return this.createTermProtected( options );
  }

  /**
   * Instantiates the Node that corresponds to this term.
   * @param {Term} term
   * @returns {TermNode}
   * @public
   * @override
   */
  createTermNode( term ) {
    return new VariableTermNode( this, term, {
      interactiveTermNodeOptions: {
        positiveFill: this.positiveFill,
        negativeFill: this.negativeFill
      }
    } );
  }
}

equalityExplorer.register( 'VariableTermCreator', VariableTermCreator );