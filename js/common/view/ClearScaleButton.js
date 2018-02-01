// Copyright 2017, University of Colorado Boulder

/**
 * Pressing this button clears all items from the scale.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {BalanceScale} scale
   * @param {Object} [options]
   * @constructor
   */
  function ClearScaleButton( scale, options ) {

    options = _.extend( {
      touchAreaDilation: 5,
      iconWidth: 22
    }, options );

    assert && assert( !options.listener, 'this type defines its listener' );
    options.listener = function() {
      scale.clear();
    };

    EraserButton.call( this, options );
  }

  equalityExplorer.register( 'ClearScaleButton', ClearScaleButton );

  return inherit( EraserButton, ClearScaleButton );
} );
