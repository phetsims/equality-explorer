// Copyright 2017-2021, University of Colorado Boulder

/**
 * Abstract base type for terms.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerConstants from '../EqualityExplorerConstants.js';
import EqualityExplorerQueryParameters from '../EqualityExplorerQueryParameters.js';
import EqualityExplorerMovable from './EqualityExplorerMovable.js';

class Term extends EqualityExplorerMovable {

  /**
   * @param {Fraction} significantValue - significant for the purposes of determining sign and maxInteger limits
   * @param {Object} [options]
   * @abstract
   */
  constructor( significantValue, options ) {

    assert && assert( significantValue instanceof Fraction, `invalid significantValue: ${significantValue}` );
    assert && assert( significantValue.isReduced(), `significantValue must be reduced: ${significantValue}` );

    options = merge( {
      pickable: true, // whether the term is pickable (interactive)
      diameter: EqualityExplorerConstants.SMALL_TERM_DIAMETER,
      toolboxPosition: null // {Vector2|null} position of the associated TermCreatorNode in the toolbox
    }, options );

    super( options );

    // @private the value that is significant for the purposes of determining sign and maxInteger limits.
    // The value that is significant is specific to the Term subtype.
    this.significantValue = significantValue;

    // @public (read-only)
    // Sign of the term's significant number, ala Math.sign.
    // Note that sign is not related to the term's weight. For example, for variable terms, the 'significant number'
    // is the coefficient. Consider term '-5x', where x=-2. While the weight is 10 (-5 * -2), the sign is based on
    // the coefficient -5, and is therefore -1.
    this.sign = Math.sign( significantValue.getValue() );

    // @public (read-only) diameter of the term in the view, convenient to store in the model
    this.diameter = options.diameter;

    // @public {Vector2|null} position of this term's corresponding TermCreatorNode in the toolbox
    this.toolboxPosition = options.toolboxPosition;

    // @public whether the term is pickable (interactive)
    this.pickableProperty = new BooleanProperty( options.pickable );

    // @public whether the term is on a plate
    this.onPlateProperty = new BooleanProperty( false );

    // @public whether the term's shadow is visible
    this.shadowVisibleProperty = new BooleanProperty( false );

    // @public whether the term's halo is visible
    this.haloVisibleProperty = new BooleanProperty( false );
  }

  /**
   * Creates the options that would be needed to instantiate a copy of this object.
   * This is used by subtypes that implement copy.
   * @returns {Object}
   * @protected
   * @override
   */
  copyOptions() {
    return merge( {
      diameter: this.diameter
    }, super.copyOptions() );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.pickableProperty.dispose();
    this.onPlateProperty.dispose();
    this.shadowVisibleProperty.dispose();
    this.haloVisibleProperty.dispose();
    super.dispose();
  }

  /**
   * Is this term the inverse of a specified term?
   * Inverse terms are like terms whose significant value has opposite signs. E.g. x and -x, 1 and -1.
   * @param {Term} term
   * @returns {boolean}
   * @public
   */
  isInverseTerm( term ) {
    return ( this.isLikeTerm( term ) && ( this.significantValue.plus( term.significantValue ).getValue() === 0 ) );
  }

  /**
   * Is this term equivalent to a specified term?
   * Equivalent terms are like terms with the same significant value.
   * @param term
   * @returns {*|boolean}
   * @public
   */
  isEquivalentTerm( term ) {
    return ( this.isLikeTerm( term ) && this.significantValue.reduced().equals( term.significantValue.reduced() ) );
  }

  /**
   * Does this term have a numerator or denominator who absolute value exceeds the maxInteger limit?
   * See EqualityExplorerQueryParameters.maxInteger and https://github.com/phetsims/equality-explorer/issues/48
   * @returns {boolean}
   * @public
   */
  maxIntegerExceeded() {
    return ( Math.abs( this.significantValue.numerator ) > EqualityExplorerQueryParameters.maxInteger ||
             Math.abs( this.significantValue.denominator ) > EqualityExplorerQueryParameters.maxInteger );
  }

  /**
   * Creates a snapshot of this term.
   * A snapshot consists of options that can be passed to the Term's constructor to re-create the Term.
   * Subtypes that have additional options should override this method and add to the options returned here.
   * @returns {Object}
   * @public
   */
  createSnapshot() {
    return {
      diameter: this.diameter
    };
  }

  //-------------------------------------------------------------------------------------------------
  // Below here are @abstract methods, to be implemented by subtypes
  //-------------------------------------------------------------------------------------------------

  /**
   * Creates a copy of this term, with modifications through options.
   * @param {Object} [options] - same as constructor options
   * @returns {Term}
   * @public
   * @abstract
   */
  copy( options ) {
    throw new Error( 'copy must be implemented by subtype' );
  }

  /**
   * Gets the weight of this term.
   * @returns {Fraction}
   * @public
   * @abstract
   */
  get weight() {
    throw new Error( 'weight must be implemented by subtype' );
  }

  /**
   * Are this term and the specified term 'like terms'?
   * If you're not familiar with 'like terms', see https://en.wikipedia.org/wiki/Like_terms.
   * @param {Term} term
   * @returns {boolean}
   * @public
   * @abstract
   */
  isLikeTerm( term ) {
    throw new Error( 'isLikeTerm must be implemented by subtype' );
  }

  /**
   * Applies an operation to this term, resulting in a new term.
   * @param {UniversalOperation} operation
   * @param {Object} [options] - same as constructor
   * @returns {Term|null} - null if the operation is not applicable to this term.
   * @public
   * @abstract
   */
  applyOperation( operation, options ) {
    throw new Error( 'applyOperation must be implemented by subtype' );
  }
}

equalityExplorer.register( 'Term', Term );

export default Term;