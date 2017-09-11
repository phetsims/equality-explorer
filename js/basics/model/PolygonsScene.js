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

  // Nodes that are reused via scenery's DAG feature
  var HEXAGON_NODE = new Path( Shape.regularPolygon( 6, EqualityExplorerConstants.ITEM_HEIGHT / 2 ), {
    fill: 'rgb( 124, 69, 157 )'
  } );
  var DIAMOND_NODE = new Path( Shape.regularPolygon( 4, EqualityExplorerConstants.ITEM_HEIGHT * Math.sin( Math.PI / 3 ) / 2 ), {
    fill: 'red'
  } );
  var TRIANGLE_NODE = new Path( Shape.regularPolygon( 3, EqualityExplorerConstants.ITEM_HEIGHT / Math.sin( Math.PI / 3 ) / 2 ), {
    fill: 'rgb( 155, 205, 100 )',
    rotation: -Math.PI / 2
  } );

  /**
   * @constructor
   */
  function PolygonsScene() {
    BasicsScene.call( this, HEXAGON_NODE, createItemCreators(), createItemCreators() );
  }

  equalityExplorer.register( 'PolygonsScene', PolygonsScene );

  /**
   * Creates the set of ItemCreators for this scene.
   * @returns {ItemCreator[]}
   */
  function createItemCreators() {
    var itemCreatorsIndex = 0;
    return [
      new ItemCreator( 'hexagon', 3, HEXAGON_NODE, {
        numberOfItemsOnScale: EqualityExplorerQueryParameters.leftItems[ itemCreatorsIndex++ ]
      } ),
      new ItemCreator( 'diamond', 2, DIAMOND_NODE, {
        numberOfItemsOnScale: EqualityExplorerQueryParameters.leftItems[ itemCreatorsIndex++ ]
      } ),
      new ItemCreator( 'triangle', 1, TRIANGLE_NODE, {
        numberOfItemsOnScale: EqualityExplorerQueryParameters.leftItems[ itemCreatorsIndex++ ]
      } )
    ];
  }

  return inherit( BasicsScene, PolygonsScene );
} );
