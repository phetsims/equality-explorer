// Copyright 2017, University of Colorado Boulder

/**
 * VariableTermCreator creates and manages variable terms (e.g. 'x').
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var ReducedFraction = require( 'EQUALITY_EXPLORER/common/model/ReducedFraction' );
  var TermCreator = require( 'EQUALITY_EXPLORER/common/model/TermCreator' );
  var VariableTerm = require( 'EQUALITY_EXPLORER/common/model/VariableTerm' );
  var VariableTermNode = require( 'EQUALITY_EXPLORER/common/view/VariableTermNode' );

  /**
   * @param {string} symbol
   * @param {NumberProperty} variableValueProperty
   * @param {Object} [options]
   * @constructor
   */
  function VariableTermCreator( symbol, variableValueProperty, options ) {

    assert && assert( variableValueProperty instanceof NumberProperty, 'invalid variableValueProperty' );

    options = _.extend( {
      defaultCoefficient: ReducedFraction.withInteger( 1 ),
      positiveFill: 'rgb( 49, 193, 238 )',
      negativeFill: 'rgb( 99, 212, 238 )'
    }, options );

    assert && assert( options.defaultCoefficient instanceof ReducedFraction, 'invalid defaultCoefficient' );

    if ( !options.icon ) {
      options.icon = VariableTermNode.createIcon( symbol, options.defaultCoefficient.toDecimal(), {
        positiveFill: options.positiveFill,
        negativeFill: options.negativeFill
      } );
    }

    // @public (read-only)
    this.symbol = symbol;
    this.defaultCoefficient = options.defaultCoefficient;
    this.variableValueProperty = variableValueProperty;

    // @private
    this.positiveFill = options.positiveFill;
    this.negativeFill = options.negativeFill;

    TermCreator.call( this, options );
  }

  equalityExplorer.register( 'VariableTermCreator', VariableTermCreator );

  return inherit( TermCreator, VariableTermCreator, {

    /**
     * Instantiates a VariableTerm.
     * @param {Object} [options] - passed to the Term's constructor
     * @returns {Term}
     * @protected
     * @override
     */
    createTermProtected: function( options ) {

      options = _.extend( {
        location: this.location,
        dragBounds: this.dragBounds,
        coefficient: this.defaultCoefficient
      }, options );

      return new VariableTerm( this.symbol, this.variableValueProperty, options );
    },

    /**
     * Instantiates the Node that corresponds to this term.
     * @param {Term} term
     * @param {Plate} plate
     * @param {Object} options - passed to the TermNode's constructor
     * @returns {TermNode}
     * @public
     * @override
     */
    createTermNode: function( term, plate, options ) {

      options = _.extend( {
        positiveFill: this.positiveFill,
        negativeFill: this.negativeFill
      }, options );

      return new VariableTermNode( this, term, plate, options );
    },

    /**
     * Is this term creator the inverse of a specified term creator?
     * @param {TermCreator} termCreator
     * @returns {boolean}
     * @public
     * @override
     */
    isInverseOf: function( termCreator ) {
      return ( termCreator.constructor === this.constructor ) &&  // same type
             ( termCreator.variableValueProperty === this.variableValueProperty ) && // same variable
             ( termCreator.defaultCoefficient.toDecimal() + this.defaultCoefficient.toDecimal() === 0 ); // coefficients sum to zero
    },

    /**
     * Is this term creator equivalent to a specified term creator?
     * @param {TermCreator} termCreator
     * @returns {boolean}
     * @public
     * @abstract
     */
    isEquivalentTo: function( termCreator ) {
      return ( termCreator.constructor === this.constructor ) &&  // same type
             ( termCreator.variableValueProperty === this.variableValueProperty ) && // same variable
             ( termCreator.defaultCoefficient.toDecimal() === this.defaultCoefficient.toDecimal() ); // same coefficients
    }
  } );
} );
 