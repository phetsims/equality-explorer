// Copyright 2017, University of Colorado Boulder

/**
 * Pressing this button clears all Items from the scale.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ResetButton = require( 'SCENERY_PHET/buttons/ResetButton' );

  /**
   * @param {BalanceScale} scale
   * @param {Object} [options]
   * @constructor
   */
  function ClearScaleButton( scale, options ) {

    options = _.extend( {

      // supertype options
      baseColor: 'rgb( 242, 242, 242 )',
      scale: 0.65,
      touchAreaDilation: 5

    }, options );

    assert && assert( !options.listener, 'button defines its listener' );
    options.listener = function() {
      scale.disposeAllItems();
    };

    ResetButton.call( this, options );
  }

  equalityExplorer.register( 'ClearScaleButton', ClearScaleButton );

  return inherit( ResetButton, ClearScaleButton );
} );
