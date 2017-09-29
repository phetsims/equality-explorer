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
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemCreator = require( 'EQUALITY_EXPLORER/common/model/ItemCreator' );

  // images
  var coin1Image = require( 'image!EQUALITY_EXPLORER/coin1.png' );
  var coin2Image = require( 'image!EQUALITY_EXPLORER/coin2.png' );
  var coin3Image = require( 'image!EQUALITY_EXPLORER/coin3.png' );

  // Caution! These Nodes that are reused via scenery's DAG feature. Do not attempt to transform them.
  var COIN1_NODE = new Image( coin1Image, {
    maxHeight: EqualityExplorerConstants.ITEM_HEIGHT
  } );
  var COIN2_NODE = new Image( coin2Image, {
    maxHeight: EqualityExplorerConstants.ITEM_HEIGHT
  } );
  var COIN3_NODE = new Image( coin3Image, {
    maxHeight: EqualityExplorerConstants.ITEM_HEIGHT
  } );

  /**
   * @constructor
   */
  function CoinsScene() {
    BasicsScene.call( this, 'coins', COIN3_NODE,
      createItemCreators( EqualityExplorerQueryParameters.leftBasics ),
      createItemCreators( EqualityExplorerQueryParameters.rightBasics ) );
  }

  equalityExplorer.register( 'CoinsScene', CoinsScene );

  /**
   * Creates the set of ItemCreators for this scene.
   * @param {number[]} numberOfItemsOnScale
   * @returns {ItemCreator[]}
   */
  function createItemCreators( numberOfItemsOnScale ) {
    assert && assert( numberOfItemsOnScale.length === 3 );
    return [
      new ItemCreator( 'coin1', 3, COIN1_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ 0 ]
      } ),
      new ItemCreator( 'coin2', 2, COIN2_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ 2 ]
      } ),
      new ItemCreator( 'coin3', 5, COIN3_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ 1 ]
      } )
    ];
  }

  return inherit( BasicsScene, CoinsScene );
} );
