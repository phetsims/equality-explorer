// Copyright 2017, University of Colorado Boulder

/**
 * Button used to clear the scale.
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
   * @param {Object} [options]
   * @constructor
   */
  function ClearScaleButton( options ) {

    options = _.extend( {
      baseColor: 'rgb( 242, 242, 242 )',
      scale: 0.65,
      touchAreaDilation: 5
    }, options );

    ResetButton.call( this, options );
  }

  equalityExplorer.register( 'ClearScaleButton', ClearScaleButton );

  return inherit( ResetButton, ClearScaleButton );
} );
