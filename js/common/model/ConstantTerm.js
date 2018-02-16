// Copyright 2017, University of Colorado Boulder

/**
 * ConstantTerm represents a constant term, and can 'sum to zero' with an inverse ConstantTerm.
 * Like MysteryTerms, it has a constant weight.
 * Unlike MysteryWeight, it's weight is revealed to the user, and it contributes to the constant term in equations.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MysteryTerm = require( 'EQUALITY_EXPLORER/common/model/MysteryTerm' );

  /**
   * @param {number} weight
   * @param {Node} icon
   * @param {Node} shadow
   * @param {Object} [options]
   * @constructor
   */
  function ConstantTerm( weight, icon, shadow, options ) {

    // @public whether the term's halo is visible
    this.haloVisibleProperty = new BooleanProperty( false );

    MysteryTerm.call( this, weight, icon, shadow, options );
  }

  equalityExplorer.register( 'ConstantTerm', ConstantTerm );

  return inherit( MysteryTerm, ConstantTerm );
} );
