// Copyright 2017-2018, University of Colorado Boulder

/**
 * MysteryTerm is a variable term whose variable value is not exposed to the user.
 * Rather than displaying a variable symbol, it displays an icon (apple, dog, turtle,...)
 * They are further constrained to having a coefficient of 1, and like terms therefore cannot be combined.
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
  var VariableTerm = require( 'EQUALITY_EXPLORER/common/model/VariableTerm' );

  /**
   * @param {string} symbol
   * @param {HTMLImageElement} image
   * @param {HTMLImageElement} shadow
   * @param {Object} [options]
   * @constructor
   */
  function MysteryTerm( symbol, image, shadow, options ) {

    options = _.extend( {
      coefficient: ReducedFraction.withInteger( 1 ),
      variableValue: 1
    }, options );

    // @public (read-only) {HTMLImageElement}
    this.image = image;
    this.shadow = shadow;

    var variableProperty = new NumberProperty( options.variableValue, {
      valueType: 'Integer'
    } );

    VariableTerm.call( this, symbol, variableProperty, options );

    // All mystery terms have a coefficient of 1, so we don't have to deal with displaying their coefficient
    // in MysteryTermNode. We can make this simplification because mystery terms appear only in the 'Basics' screen,
    // where like terms are not combined.
    // unlink not required.
    this.coefficientProperty.link( function( coefficient ) {
      assert && assert( coefficient.toDecimal() === 1, 'invalid coefficient: ' + coefficient.toString() );
    } );
  }

  equalityExplorer.register( 'MysteryTerm', MysteryTerm );

  return inherit( VariableTerm, MysteryTerm );
} );
 