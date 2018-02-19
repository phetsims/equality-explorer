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
  var TermCreator = require( 'EQUALITY_EXPLORER/common/model/TermCreator' );
  var VariableTerm = require( 'EQUALITY_EXPLORER/common/model/VariableTerm' );

  /**
   * @param {string} symbol
   * @param {Node} icon
   * @param {Node} shadow
   * @param {Object} [options]
   * @constructor
   */
  function VariableTermCreator( symbol, icon, shadow, options ) {

    var self = this;

    options = _.extend( {
      weight: 1,
      sign: 1 // determines the sign of 'x' (1 positive, -1 negative)
    }, options );

    assert && assert( options.sign === 1 || options.sign === -1,
      'invalid sign: ' + options.sign );
    
    // @public (read-only)
    this.symbol = symbol;

    // @public
    this.weightProperty = new NumberProperty( options.weight, {
      valueType: 'Integer'
    } );

    // @public (read-only)
    this.sign = options.sign;

    TermCreator.call( this, icon, shadow, options );

    // Update the weight of all VariableTerms. unlink unnecessary
    this.weightProperty.link( function( weight ) {
      var terms = self.getTerms();
      for ( var i = 0; i < terms.length; i++ ) {
        terms[ i ].weightProperty.value = weight;
      }
    } );
  }

  equalityExplorer.register( 'VariableTermCreator', VariableTermCreator );

  return inherit( TermCreator, VariableTermCreator, {

    /**
     * Instantiates a VariableTerm.
     * @param {Vector2} location
     * @returns {Term}
     * @protected
     * @override
     */
    createTermProtected: function( location ) {
      return new VariableTerm( this.symbol, this.weightProperty, this.sign, this.icon, this.shadow, {
        location: location,
        dragBounds: this.dragBounds
      } );
    },

    /**
     * Gets the term's weight.
     * @returns {number}
     * @public
     * @override
     */
    get weight() {
      return this.weightProperty.value;
    },

    /**
     * Is this term creator the inverse of a specified term creator?
     * @param {TermCreator} termCreator
     * @returns {boolean}
     * @public
     * @override
     */
    isInverseOf: function( termCreator ) {
      return ( this.symbol === termCreator.symbol ) &&
             TermCreator.prototype.isInverseOf.call( this, termCreator );
    }
  } );
} );
 