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
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemCreator = require( 'EQUALITY_EXPLORER/common/model/ItemCreator' );
  var ItemIcons = require( 'EQUALITY_EXPLORER/common/view/ItemIcons' );

  /**
   * @constructor
   */
  function FruitsScene() {
    BasicsScene.call( this, 'fruits', ItemIcons.APPLE_NODE,
      createItemCreators( EqualityExplorerQueryParameters.leftBasics ),
      createItemCreators( EqualityExplorerQueryParameters.rightBasics ) );
  }

  equalityExplorer.register( 'FruitsScene', FruitsScene );

  /**
   * Creates the set of ItemCreators for this scene.
   * @param {number[]} numberOfItemsOnScale
   * @returns {ItemCreator[]}
   */
  function createItemCreators( numberOfItemsOnScale ) {
    assert && assert( numberOfItemsOnScale.length === 3 );
    return [
      new ItemCreator( 'apple', 4, ItemIcons.APPLE_NODE, ItemIcons.APPLE_SHADOW_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ 0 ]
      } ),
      new ItemCreator( 'lemon', 5, ItemIcons.LEMON_NODE, ItemIcons.LEMON_SHADOW_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ 2 ]
      } ),
      new ItemCreator( 'orange', 2, ItemIcons.ORANGE_NODE, ItemIcons.ORANGE_SHADOW_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ 1 ]
      } )
    ];
  }

  return inherit( BasicsScene, FruitsScene );
} );
