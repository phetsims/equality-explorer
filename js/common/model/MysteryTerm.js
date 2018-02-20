// Copyright 2017-2018, University of Colorado Boulder

/**
 * MysteryTerm is a variable term whose variable value is not exposed to the user.
 * Rather than displaying a variable symbol, it displays an icon (apple, dog, turtle,...)
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
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
      variableValue: 1
    }, options );

    // @public (read-only) {HTMLImageElement}
    this.image = image;
    this.shadow = shadow;

    var variableProperty = new NumberProperty( options.variableValue, {
      valueType: 'Integer'
    } );

    VariableTerm.call( this, symbol, variableProperty, options );
  }

  equalityExplorer.register( 'MysteryTerm', MysteryTerm );

  return inherit( VariableTerm, MysteryTerm );
} );
 