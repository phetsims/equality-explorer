// Copyright 2017, University of Colorado Boulder

/**
 * Pressing this button will organize the items on the scale, grouping like items together.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var Shape = require( 'KITE/Shape' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function OrganizeButton( options ) {

    options = _.extend( {
      baseColor: PhetColorScheme.PHET_LOGO_YELLOW
    }, options );

    //TODO finalize icon for OrganizeButton
    var diameter = 9;
    var spacing = 3;
    var iconShape = new Shape()
      .rect( 0, 0, diameter, diameter )
      .rect( 0, diameter + spacing, diameter, diameter )
      .rect( diameter + spacing, diameter + spacing, diameter, diameter  )
      .circle( 3 * ( diameter + spacing ), 0.5 * diameter, diameter / 2 )
      .circle( 3 * ( diameter + spacing ), 1.5 * diameter + spacing, diameter / 2 );

    var iconNode = new Path( iconShape, {
      fill: 'black'
    } );

    assert && assert( !options.content, 'button provides its own content' );
    options.content = iconNode;

    RectangularPushButton.call( this, options );
  }

  equalityExplorer.register( 'OrganizeButton', OrganizeButton );

  return inherit( RectangularPushButton, OrganizeButton );
} );
