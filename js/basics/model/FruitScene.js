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
    BasicsScene.call( this, APPLE_NODE, createItemCreators(), createItemCreators() );
  }

  equalityExplorer.register( 'FruitScene', FruitScene );

  /**
   * Creates the set of ItemCreators for this scene.
   * @returns {ItemCreator[]}
   */
  function createItemCreators() {
    var itemCreatorsIndex = 0;
    return [
      new ItemCreator( 'apple', 3, APPLE_NODE, {
        numberOfItemsOnScale: EqualityExplorerQueryParameters.leftItems[ itemCreatorsIndex++ ]
      } ),
      new ItemCreator( 'orange', 2, ORANGE_NODE, {
        numberOfItemsOnScale: EqualityExplorerQueryParameters.leftItems[ itemCreatorsIndex++ ]
      } ),
      new ItemCreator( 'one', 1, ONE_NODE, {
        numberOfItemsOnScale: EqualityExplorerQueryParameters.leftItems[ itemCreatorsIndex++ ],
        constantTerm: true
      } )
    ];
  }

  return inherit( BasicsScene, FruitScene );
} );
