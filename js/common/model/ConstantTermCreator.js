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
      defaultConstantValue: ReducedFraction.withInteger( 1 ) // terms are created with this value by default
    }, options );

    assert && assert( options.defaultConstantValue instanceof ReducedFraction, 'invalid defaultConstantValue' );

    // @public (read-only) terms are created with this value by default
    this.defaultConstantValue = options.defaultConstantValue;

    var icon = ConstantTermNode.createIcon( options.defaultConstantValue.toDecimal() );

    TermCreator.call( this, icon, options );
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
        constantValue: this.defaultConstantValue
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
      return ( termCreator instanceof ConstantTermCreator ) &&
             ( termCreator.defaultConstantValue.toDecimal() === -this.defaultConstantValue.toDecimal() ); // inverse values
    },

    /**
     * Is this term creator equivalent to a specified term creator?
     * @param {TermCreator} termCreator
     * @returns {boolean}
     * @public
     * @abstract
     */
    isEquivalentTo: function( termCreator ) {
      return ( termCreator instanceof ConstantTermCreator ) &&
             ( termCreator.defaultConstantValue.toDecimal() === this.defaultConstantValue.toDecimal() ); // same values
    }
  } );
} );
 