// Copyright 2017, University of Colorado Boulder

/**
 * Pressing this button organizes Items on the scale, grouping like items together.
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
   * @param {BalanceScale} scale
   * @param {Object} [options]
   * @constructor
   */
  function OrganizeButton( scale, options ) {

    var self = this;

    options = _.extend( {

      // supertype options
      baseColor: PhetColorScheme.BUTTON_YELLOW,
      xMargin: 8,
      yMargin: 4,
      touchAreaXDilation: 5,
      touchAreaYDilation: 5

    }, options );

    assert && assert( !options.content, 'this subtype defines its content' );
    options.content = createButtonContent();

    assert && assert( !options.listener, 'this subtype defines its listener' );
    options.listener = function() {
      scale.organize();
      self.enabled = false;
    };

    RectangularPushButton.call( this, options );
  }

  equalityExplorer.register( 'OrganizeButton', OrganizeButton );

  /**
   * Creates the icon that appears on the button.
   * @returns {Node}
   */
  function createButtonContent() {

    var diameter = 6; // diameter of each item
    var xSpacing = 2; // horizontal space between columns
    var xSpacingExtra = 3; // extra horizontal space between columns with different types of items
    var ySpacing = 1; // vertical space between items in a column

    var iconShape = new Shape();

    // 2 columns of 3 circles
    var left = 0;
    var top = 0;
    for ( var column = 0; column < 2; column++ ) {
      for (var row = 0; row < 3; row++ ) {
        iconShape.circle( left + 0.5 * diameter, top + 0.5 * diameter, diameter / 2 );
        top += ( diameter + ySpacing );
      }
      left += ( diameter + xSpacing );
      top = 0;
    }

    // 1 column of 2 squares
    left += xSpacingExtra;
    top = diameter + ySpacing;
    for ( row = 0; row < 2; row++ ) {
      iconShape.rect( left, top, diameter, diameter );
      top += ( diameter + ySpacing );
    }

    // 1 column of 3 triangles
    left += ( diameter + xSpacing + xSpacingExtra );
    top = 0;
    for ( row = 0; row < 3; row++ ) {
      
      // described from top center, moving clockwise
      iconShape.moveTo( left + 0.5 * diameter, top )
        .lineTo( left + diameter, top + diameter )
        .lineTo( left, top + diameter )
        .close();
      top += ( diameter + ySpacing );
    }

    return new Path( iconShape, {
      fill: 'black'
    } );
  }

  return inherit( RectangularPushButton, OrganizeButton );
} );
