// Copyright 2017, University of Colorado Boulder

//TODO placeholder
/**
 * Panel that contains the items that can be dragged out onto the scale.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );

  // constants
  var ITEM_RADIUS = 22;

  /**
   * @param {Object} [options]
   * @constructor
   */
  function ItemPanel( options ) {

    options = _.extend( {
      lineWidth: 2,
      cornerRadius: 6
    }, options );

    var backgroundNode = new Rectangle( 0, 0, 275, 50 );

    // '1'
    var circle = new Circle( ITEM_RADIUS, {
      stroke: 'black',
      fill: 'rgb( 246, 229, 214 )'
    } );
    var oneText = new Text( '1', {
      font: new PhetFont( 22 ),
      maxHeight: 0.85 * circle.height,
      center: circle.center
    } );
    var oneNode = new Node( {
      children: [ circle, oneText ]
    } );

    // triangle
    var polygonNode = new Path( Shape.regularPolygon( 6, ITEM_RADIUS ), {
      fill: 'rgb( 124, 69, 157 )'
    } );

    // triangle
    var triangleNode = new Path( Shape.regularPolygon( 3, ITEM_RADIUS ), {
      fill: 'rgb( 155, 205, 100 )',
      rotation: -Math.PI / 2
    } );
    
    var hBox = new HBox( {
      spacing: 40,
      children: [ oneNode, polygonNode, triangleNode ],
      center: backgroundNode.center
    });

    var content = new Node( {
      children: [ backgroundNode, hBox ]
    });

    Panel.call( this, content, options );
  }

  equalityExplorer.register( 'ItemPanel', ItemPanel );

  return inherit( Panel, ItemPanel );
} );
