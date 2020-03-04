// Copyright 2017-2020, University of Colorado Boulder

/**
 * VariableTermCreator creates and manages variable terms (e.g. 'x').
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerColors from '../EqualityExplorerColors.js';
import EqualityExplorerConstants from '../EqualityExplorerConstants.js';
import VariableTermNode from '../view/VariableTermNode.js';
import TermCreator from './TermCreator.js';
import VariableTerm from './VariableTerm.js';

/**
 * @param {Variable} variable
 * @param {Object} [options]
 * @constructor
 */
function VariableTermCreator( variable, options ) {

  options = merge( {
    positiveFill: EqualityExplorerColors.POSITIVE_X_FILL,
    negativeFill: EqualityExplorerColors.NEGATIVE_X_FILL
  }, options );

  // @public (read-only)
  this.variable = variable;

  // @private
  this.positiveFill = options.positiveFill;
  this.negativeFill = options.negativeFill;

  TermCreator.call( this, options );

  // When the variable values changes, recompute the weight of terms on the scale. unlink not needed.
  this.variable.valueProperty.link( variableValue => this.updateWeightOnPlateProperty() );
}

equalityExplorer.register( 'VariableTermCreator', VariableTermCreator );

export default inherit( TermCreator, VariableTermCreator, {

  /**
   * Returns the sum of coefficients for all terms on the plate.
   * @returns {Fraction}
   * @public
   */
  sumCoefficientsOnPlate: function() {
    let sum = Fraction.fromInteger( 0 );
    for ( let i = 0; i < this.termsOnPlate.length; i++ ) {
      sum = sum.plus( this.termsOnPlate.get( i ).coefficient ).reduced();
    }
    return sum;
  },

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
  createIcon: function( options ) {

    options = merge( {
      sign: 1  // sign of the coefficient shown on the icon, 1 or -1
    }, options );
    assert && assert( options.sign === 1 || options.sign === -1, 'invalid sign: ' + options.sign );

    const coefficient = EqualityExplorerConstants.DEFAULT_COEFFICIENT.timesInteger( options.sign );
    return VariableTermNode.createInteractiveTermNode( coefficient, this.variable.symbol, {
      positiveFill: this.positiveFill,
      negativeFill: this.negativeFill
    } );
  },

  /**
   * Instantiates a VariableTerm.
   * @param {Object} [options] - passed to the VariableTerm's constructor
   * @returns {Term}
   * @protected
   * @override
   */
  createTermProtected: function( options ) {

    options = merge( {
      sign: 1
    }, options );
    assert && assert( options.sign === 1 || options.sign === -1, 'invalid sign: ' + options.sign );

    // If the coefficient wasn't specified, use the default.
    options.coefficient = options.coefficient || EqualityExplorerConstants.DEFAULT_COEFFICIENT;

    // Adjust the sign
    options.coefficient = options.coefficient.timesInteger( options.sign );

    return new VariableTerm( this.variable, options );
  },

  /**
   * Creates a term whose significant value is zero. This is used when applying an operation to an empty plate.
   * The term is not managed by the TermCreator.
   * @param {Object} [options] - VariableTerm options
   * @returns {Term}
   * @public
   * @override
   */
  createZeroTerm: function( options ) {
    options = options || {};
    assert && assert( !options.coefficient, 'VariableTermCreator sets coefficient' );
    options.coefficient = Fraction.fromInteger( 0 );
    return this.createTermProtected( options );
  },

  /**
   * Instantiates the Node that corresponds to this term.
   * @param {Term} term
   * @param {Object} [options] - passed to the VariableTermNode's constructor
   * @returns {TermNode}
   * @public
   * @override
   */
  createTermNode: function( term, options ) {
    return new VariableTermNode( this, term, merge( {
      positiveFill: this.positiveFill,
      negativeFill: this.negativeFill
    }, options ) );
  }
} );