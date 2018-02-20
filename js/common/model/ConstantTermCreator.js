// Copyright 2018, University of Colorado Boulder

/**
 * ConstantTermCreator creates and manages constant terms.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ConstantTerm = require( 'EQUALITY_EXPLORER/common/model/ConstantTerm' );
  var ConstantTermNode = require( 'EQUALITY_EXPLORER/common/view/ConstantTermNode' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ReducedFraction = require( 'EQUALITY_EXPLORER/common/model/ReducedFraction' );
  var TermCreator = require( 'EQUALITY_EXPLORER/common/model/TermCreator' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function ConstantTermCreator( options ) {

    options = _.extend( {
      defaultValue: ReducedFraction.withInteger( 1 ) // {ReducedFraction} initial value
    }, options );

    assert && assert( options.defaultValue instanceof ReducedFraction, 'invalid defaultValue' );

    assert && assert( !options.icon, 'icon is created by this type' );
    options.icon = ConstantTermNode.createIcon( options.defaultValue.toDecimal() );

    // @public (read-only)
    this.defaultValue = options.defaultValue;

    TermCreator.call( this, options );
  }

  equalityExplorer.register( 'ConstantTermCreator', ConstantTermCreator );

  return inherit( TermCreator, ConstantTermCreator, {

    /**
     * Instantiates a ConstantTerm.
     * @param {Object} [options]
     * @returns {Term}
     * @protected
     * @override
     */
    createTermProtected: function( options ) {

      options = _.extend( {
        location: this.location,
        dragBounds: this.dragBounds,
        value: this.defaultValue
      }, options );

      return new ConstantTerm( options );
    },

    /**
     * Instantiates the Node that corresponds to this term.
     * @param {Term} term
     * @param {Plate} plate
     * @param {Object} options
     * @returns {TermNode}
     * @public
     * @override
     */
    createTermNode: function( term, plate, options ) {
      return new ConstantTermNode( this, term, plate, options );
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
             ( termCreator.defaultValue.toDecimal() + this.defaultValue.toDecimal() === 0 ); // values sum to zero
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
             ( termCreator.defaultValue.toDecimal() === this.defaultValue.toDecimal() ) ; // same values
    }
  } );
} );
 