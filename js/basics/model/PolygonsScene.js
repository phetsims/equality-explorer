// Copyright 2017, University of Colorado Boulder

/**
 * The 'Polygons' scene in the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BasicsScene = require( 'EQUALITY_EXPLORER/basics/model/BasicsScene' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemCreator = require( 'EQUALITY_EXPLORER/common/model/ItemCreator' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  // constants
  var ITEM_RADIUS = 22;

  /**
   * @constructor
   */
  function PolygonsScene() {

    // icons for each Item type
    var hexagonNode = new Path( Shape.regularPolygon( 6, ITEM_RADIUS ), {
      fill: 'rgb( 124, 69, 157 )'
    } );
    var diamondNode = new Path( Shape.regularPolygon( 4, ITEM_RADIUS ), {
      fill: 'red'
    } );
    var triangleNode = new Path( Shape.regularPolygon( 3, ITEM_RADIUS ), {
      fill: 'rgb( 155, 205, 100 )',
      rotation: -Math.PI / 2
    } );

    var itemCreators = [
      new ItemCreator( 3, hexagonNode ),
      new ItemCreator( 2, diamondNode ),
      new ItemCreator( 1, triangleNode )
    ];

    BasicsScene.call( this, hexagonNode, itemCreators );
  }

  equalityExplorer.register( 'PolygonsScene', PolygonsScene );

  return inherit( BasicsScene, PolygonsScene );
} );
