// Copyright 2017, University of Colorado Boulder

/**
 * The 'Fruit' scene in the 'Basics' screen.
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
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemCreator = require( 'EQUALITY_EXPLORER/common/model/ItemCreator' );
  var NumberNode = require( 'EQUALITY_EXPLORER/common/view/NumberNode' );

  // images
  var appleImage = require( 'image!EQUALITY_EXPLORER/apple.png' );
  var orangeImage = require( 'image!EQUALITY_EXPLORER/orange.png' );

  // Nodes that are reused via scenery's DAG feature
  var ONE_NODE = new NumberNode( 1, {
    radius: EqualityExplorerConstants.ITEM_HEIGHT / 2,
    fill: 'rgb( 246, 229, 214 )'
  } );
  var APPLE_NODE = new Image( appleImage, {
    maxHeight: EqualityExplorerConstants.ITEM_HEIGHT
  } );
  var ORANGE_NODE = new Image( orangeImage, {
    maxHeight: EqualityExplorerConstants.ITEM_HEIGHT
  } );

  /**
   * @constructor
   */
  function FruitScene() {
    BasicsScene.call( this, APPLE_NODE,
      createItemCreators( EqualityExplorerQueryParameters.leftItems ),
      createItemCreators( EqualityExplorerQueryParameters.rightItems ) );
  }

  equalityExplorer.register( 'FruitScene', FruitScene );

  /**
   * Creates the set of ItemCreators for this scene.
   * @param {number[]} numberOfItemsOnScale
   * @returns {ItemCreator[]}
   */
  function createItemCreators( numberOfItemsOnScale ) {

    var fruitWeights = EqualityExplorerQueryParameters.fruitWeights;
    if ( fruitWeights.length !== 3 ) {
      throw new Error( 'fruitWeights query parameter requires 3 values' );
    }

    var itemCreatorsIndex = 0;
    return [
      new ItemCreator( 'apple', fruitWeights[ 0 ], APPLE_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ itemCreatorsIndex++ ]
      } ),
      new ItemCreator( 'orange', fruitWeights[ 1 ], ORANGE_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ itemCreatorsIndex++ ]
      } ),
      new ItemCreator( 'one', fruitWeights[ 2 ], ONE_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ itemCreatorsIndex++ ],
        constantTerm: true
      } )
    ];
  }

  return inherit( BasicsScene, FruitScene );
} );
