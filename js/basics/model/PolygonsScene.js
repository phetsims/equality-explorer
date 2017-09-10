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
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemCreator = require( 'EQUALITY_EXPLORER/common/model/ItemCreator' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  /**
   * @constructor
   */
  function PolygonsScene() {

    // icons for each Item type
    var hexagonNode = new Path( Shape.regularPolygon( 6, EqualityExplorerConstants.ITEM_HEIGHT ), {
      fill: 'rgb( 124, 69, 157 )'
    } );

    var diamondSideLength = EqualityExplorerConstants.ITEM_HEIGHT * Math.sin( Math.PI / 3 );
    var diamondNode = new Path( Shape.regularPolygon( 4, diamondSideLength ), {
      fill: 'red'
    } );

    var triangleSideLength = EqualityExplorerConstants.ITEM_HEIGHT / Math.sin( Math.PI / 3 );
    var triangleNode = new Path( Shape.regularPolygon( 3, triangleSideLength ), {
      fill: 'rgb( 155, 205, 100 )',
      rotation: -Math.PI / 2
    } );

    var itemCreatorsIndex = 0;
    var leftItemCreators = [
      new ItemCreator( 'hexagon', 3, hexagonNode, {
        numberOfItemsOnScale: EqualityExplorerQueryParameters.leftItems[ itemCreatorsIndex++ ]
      } ),
      new ItemCreator( 'diamond', 2, diamondNode, {
        numberOfItemsOnScale: EqualityExplorerQueryParameters.leftItems[ itemCreatorsIndex++ ]
      } ),
      new ItemCreator( 'triangle', 1, triangleNode, {
        numberOfItemsOnScale: EqualityExplorerQueryParameters.leftItems[ itemCreatorsIndex++ ]
      } )
    ];

    //TODO duplicate code
    itemCreatorsIndex = 0;
    var rightItemCreators = [
      new ItemCreator( 'hexagon', 3, hexagonNode, {
        numberOfItemsOnScale: EqualityExplorerQueryParameters.rightItems[ itemCreatorsIndex++ ]
      } ),
      new ItemCreator( 'diamond', 2, diamondNode, {
        numberOfItemsOnScale: EqualityExplorerQueryParameters.rightItems[ itemCreatorsIndex++ ]
      } ),
      new ItemCreator( 'triangle', 1, triangleNode, {
        numberOfItemsOnScale: EqualityExplorerQueryParameters.rightItems[ itemCreatorsIndex++ ]
      } )
    ];

    BasicsScene.call( this, hexagonNode, leftItemCreators, rightItemCreators );
  }

  equalityExplorer.register( 'PolygonsScene', PolygonsScene );

  return inherit( BasicsScene, PolygonsScene );
} );
