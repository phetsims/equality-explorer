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
  var ConstantItemCreator = require( 'EQUALITY_EXPLORER/common/model/ConstantItemCreator' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemIcons = require( 'EQUALITY_EXPLORER/common/view/ItemIcons' );

  /**
   * @constructor
   */
  function FruitsScene() {
    BasicsScene.call( this, 'fruits', ItemIcons.APPLE_NODE,
      createItemCreators( EqualityExplorerQueryParameters.leftBasics ),
      createItemCreators( EqualityExplorerQueryParameters.rightBasics )
    );
  }

  equalityExplorer.register( 'FruitsScene', FruitsScene );

  /**
   * Creates the set of ItemCreators for this scene.
   * @param {number[]} numberOfItemsOnScale
   * @returns {ItemCreator[]}
   */
  function createItemCreators( numberOfItemsOnScale ) {
    assert && assert( numberOfItemsOnScale.length === 3 );
    var index = 0;
    return [
      new ConstantItemCreator( 4, ItemIcons.APPLE_NODE, ItemIcons.APPLE_SHADOW_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ index++ ]
      } ),
      new ConstantItemCreator( 5, ItemIcons.LEMON_NODE, ItemIcons.LEMON_SHADOW_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ index++ ]
      } ),
      new ConstantItemCreator( 2, ItemIcons.ORANGE_NODE, ItemIcons.ORANGE_SHADOW_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ index++ ]
      } )
    ];
  }

  return inherit( BasicsScene, FruitsScene );
} );
