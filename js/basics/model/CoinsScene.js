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
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemCreator = require( 'EQUALITY_EXPLORER/common/model/ItemCreator' );

  /**
   * @constructor
   */
  function CoinsScene() {
    BasicsScene.call( this, 'coins', EqualityExplorerConstants.COIN3_NODE,
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
      new ItemCreator( 'coin1', 3, EqualityExplorerConstants.COIN1_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ 0 ]
      } ),
      new ItemCreator( 'coin2', 2, EqualityExplorerConstants.COIN2_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ 2 ]
      } ),
      new ItemCreator( 'coin3', 5, EqualityExplorerConstants.COIN3_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ 1 ]
      } )
    ];
  }

  return inherit( BasicsScene, CoinsScene );
} );
