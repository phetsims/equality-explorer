// Copyright 2018-2022, University of Colorado Boulder

/**
 * ConstantTermCreator creates and manages constant terms.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerConstants from '../EqualityExplorerConstants.js';
import ConstantTermNode from '../view/ConstantTermNode.js';
import ConstantTerm from './ConstantTerm.js';
import TermCreator from './TermCreator.js';

export default class ConstantTermCreator extends TermCreator {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {
    super( options );
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
   * Returns the sum of constant values for all terms on the plate.
   * @returns {Fraction}
   * @public
   */
  sumConstantsOnPlate() {
    let sum = Fraction.fromInteger( 0 );
    for ( let i = 0; i < this.termsOnPlate.length; i++ ) {
      sum = sum.plus( this.termsOnPlate.get( i ).constantValue ).reduced();
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
      sign: 1  // sign of the constant shown on the icon, 1 or -1
    }, options );
    assert && assert( options.sign === 1 || options.sign === -1, `invalid sign: ${options.sign}` );

    const constantValue = EqualityExplorerConstants.DEFAULT_CONSTANT_VALUE.timesInteger( options.sign );
    return ConstantTermNode.createInteractiveTermNode( constantValue );
  }

  /**
   * Instantiates a ConstantTerm.
   * @param {Object} [options] - passed to the ConstantTerm's constructor
   * @returns {Term}
   * @protected
   * @override
   */
  createTermProtected( options ) {

    options = merge( {
      sign: 1
    }, options );
    assert && assert( options.sign === 1 || options.sign === -1, `invalid sign: ${options.sign}` );

    // If the constant value wasn't specified, use the default.
    options.constantValue = options.constantValue || EqualityExplorerConstants.DEFAULT_CONSTANT_VALUE;

    // Adjust the sign
    options.constantValue = options.constantValue.timesInteger( options.sign );

    return new ConstantTerm( options );
  }

  /**
   * Creates a term whose significant value is zero. The term is not managed by the TermCreator.
   * This is used when applying an operation to an empty plate.
   * @param {Object} [options] - ConstantTerm options
   * @returns {Term}
   * @public
   * @override
   */
  createZeroTerm( options ) {
    options = options || {};
    assert && assert( !options.constantValue, 'ConstantTermCreator sets constantValue' );
    options.constantValue = Fraction.fromInteger( 0 );
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
    return new ConstantTermNode( this, term );
  }
}

equalityExplorer.register( 'ConstantTermCreator', ConstantTermCreator );