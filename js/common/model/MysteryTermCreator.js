// Copyright 2017-2018, University of Colorado Boulder

/**
 * MysteryTermCreator creates and manages mystery terms (apple, dog, turtle,...)
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MysteryTerm = require( 'EQUALITY_EXPLORER/common/model/MysteryTerm' );
  var MysteryTermNode = require( 'EQUALITY_EXPLORER/common/view/MysteryTermNode' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var ReducedFraction = require( 'EQUALITY_EXPLORER/common/model/ReducedFraction' );
  var VariableTermCreator = require( 'EQUALITY_EXPLORER/common/model/VariableTermCreator' );

  /**
   * @param {string} symbol
   * @param {number} weight - integer weight of 1 mystery item
   * @param {HTMLImageElement} image
   * @param {HTMLImageElement} shadow
   * @param {Object} [options]
   * @constructor
   */
  function MysteryTermCreator( symbol, weight, image, shadow, options ) {

    options = options || {};

    // All mystery terms have a coefficient of 1, so we don't have to deal with displaying their coefficient
    // in MysteryTermNode. We can make this simplification because mystery terms appear only in the 'Basics' screen,
    // where like terms are not combined.
    assert && assert( !options.defaultCoefficient, 'defaultCoefficient is set by MysteryTermCreator' );
    options.defaultCoefficient = ReducedFraction.withInteger( 1 );

    assert && assert( !options.icon, 'icon is set by MysteryTermCreator' );
    options.icon = MysteryTermNode.createIcon( image );

    // @public (read-only) {HTMLImageElement}
    this.image = image;
    this.shadow = shadow;

    var variableValueProperty = new NumberProperty( weight, {
      numberType: 'Integer'
    } );

    VariableTermCreator.call( this, symbol, variableValueProperty, options );
  }

  equalityExplorer.register( 'MysteryTermCreator', MysteryTermCreator );

  return inherit( VariableTermCreator, MysteryTermCreator, {

    /**
     * Instantiates a MysteryTerm.
     * @param {Object} [options] - passed to the Term's constructor
     * @returns {Term}
     * @protected
     * @override
     */
    createTermProtected: function( options ) {

      options = _.extend( {
        location: this.location,
        dragBounds: this.dragBounds,
        variableValue: this.variableValueProperty.value
      }, options );

      return new MysteryTerm( this.symbol, this.image, this.shadow, options );
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
      return new MysteryTermNode( this, term, plate, options );
    }
  } );
} );
 