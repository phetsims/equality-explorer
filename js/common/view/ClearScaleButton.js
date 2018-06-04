// Copyright 2017-2018, University of Colorado Boulder

/**
 * Pressing this button clears all terms from the scale.
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
   * @param {function} clearScaleFunction
   * @param {Object} [options]
   * @constructor
   */
  function ClearScaleButton( clearScaleFunction, options ) {

    options = _.extend( {

      // EraserButton options
      touchAreaDilation: 5,
      iconWidth: 22
    }, options );

    assert && assert( !options.listener, 'ClearScaleButton sets listener' );
    options.listener = function() {
      phet.log && phet.log( 'ClearScaleButton pressed' );
      clearScaleFunction();
    };

    EraserButton.call( this, options );
  }

  equalityExplorer.register( 'ClearScaleButton', ClearScaleButton );

  return inherit( EraserButton, ClearScaleButton );
} );
