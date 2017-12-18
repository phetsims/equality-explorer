// Copyright 2017, University of Colorado Boulder

/**
 * The 'Coins' scene in the 'Basics' screen.
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
  var ItemIcons = require( 'EQUALITY_EXPLORER/common/view/ItemIcons' );
  var MysteryItemCreator = require( 'EQUALITY_EXPLORER/common/model/MysteryItemCreator' );

  /**
   * @constructor
   */
  function CoinsScene() {
    BasicsScene.call( this, 'coins', ItemIcons.COIN3_NODE,
      createItemCreators( EqualityExplorerQueryParameters.leftBasics ),
      createItemCreators( EqualityExplorerQueryParameters.rightBasics )
    );
  }

  equalityExplorer.register( 'CoinsScene', CoinsScene );

  /**
   * Creates the item creators for this scene.
   * @param {number[]} initialNumberOfItemsOnScale
   * @returns {AbstractItemCreator[]}
   */
  function createItemCreators( initialNumberOfItemsOnScale ) {
    assert && assert( initialNumberOfItemsOnScale.length === 3 );
    var index = 0;
    return [
      new MysteryItemCreator( ItemIcons.COIN1_NODE, ItemIcons.COIN1_SHADOW_NODE, {
        weight: 3,
        initialNumberOfItemsOnScale: initialNumberOfItemsOnScale[ index++ ]
      } ),
      new MysteryItemCreator( ItemIcons.COIN2_NODE, ItemIcons.COIN2_SHADOW_NODE, {
        weight: 2,
        initialNumberOfItemsOnScale: initialNumberOfItemsOnScale[ index++ ]
      } ),
      new MysteryItemCreator( ItemIcons.COIN3_NODE, ItemIcons.COIN3_SHADOW_NODE, {
        weight: 5,
        initialNumberOfItemsOnScale: initialNumberOfItemsOnScale[ index++ ]
      } )
    ];
  }

  return inherit( BasicsScene, CoinsScene );
} );
