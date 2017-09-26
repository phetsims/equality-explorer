// Copyright 2014-2016, University of Colorado Boulder

/**
 * Control for turning coupling on/off.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );

  /**
   * @param {Property.<boolean>} coupledProperty
   * @param {Object} [options]
   * @constructor
   */
  function CoupledControl( coupledProperty, options ) {

    options = _.extend( {
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      selectedLineWidth: 2,
      spacing: 4,
      orientation: 'vertical',
      scale: 0.45
    }, options );

    RadioButtonGroup.call( this, coupledProperty, [
      { value: true, node: new FontAwesomeNode( 'link', { rotation: -Math.PI / 4 } ) },
      { value: false, node: new FontAwesomeNode( 'unlink', { rotation: -Math.PI / 4 } ) }
    ], options );
  }

  equalityExplorer.register( 'CoupledControl', CoupledControl );

  return inherit( RadioButtonGroup, CoupledControl );
} );