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
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemCreator = require( 'EQUALITY_EXPLORER/common/model/ItemCreator' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  /**
   * @constructor
   */
  function PolygonsScene() {

    // icons for each Item type
    var hexagonNode = new Path( Shape.regularPolygon( 6, EqualityExplorerConstants.ITEM_RADIUS ), {
      fill: 'rgb( 124, 69, 157 )'
    } );
    var diamondNode = new Path( Shape.regularPolygon( 4, EqualityExplorerConstants.ITEM_RADIUS ), {
      fill: 'red'
    } );
    var triangleNode = new Path( Shape.regularPolygon( 3, EqualityExplorerConstants.ITEM_RADIUS ), {
      fill: 'rgb( 155, 205, 100 )',
      rotation: -Math.PI / 2
    } );

    var leftItemCreators = [
      new ItemCreator( 'hexagon', 3, hexagonNode ),
      new ItemCreator( 'diamond', 2, diamondNode ),
      new ItemCreator( 'triangle', 1, triangleNode )
    ];

    var rightItemCreators = [
      new ItemCreator( 'hexagon', 3, hexagonNode ),
      new ItemCreator( 'diamond', 2, diamondNode ),
      new ItemCreator( 'triangle', 1, triangleNode )
    ];

    BasicsScene.call( this, hexagonNode, leftItemCreators, rightItemCreators );
  }

  equalityExplorer.register( 'PolygonsScene', PolygonsScene );

  return inherit( BasicsScene, PolygonsScene );
} );
