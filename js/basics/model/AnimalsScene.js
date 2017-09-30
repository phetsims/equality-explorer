// Copyright 2017, University of Colorado Boulder

/**
 * The 'Animals' scene in the 'Basics' screen.
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
  function AnimalsScene() {
    BasicsScene.call( this, 'animals', ItemIcons.ANIMAL1_NODE,
      createItemCreators( EqualityExplorerQueryParameters.leftBasics ),
      createItemCreators( EqualityExplorerQueryParameters.rightBasics ), {
        maxWeight: 50
      } );
  }

  equalityExplorer.register( 'AnimalsScene', AnimalsScene );

  /**
   * Creates the set of ItemCreators for this scene.
   * @param {number[]} numberOfItemsOnScale
   * @returns {ItemCreator[]}
   */
  function createItemCreators( numberOfItemsOnScale ) {
    assert && assert( numberOfItemsOnScale.length === 3 );
    return [
      new ItemCreator( 'animal1', 11, ItemIcons.ANIMAL1_NODE, ItemIcons.ANIMAL1_SHADOW_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ 0 ]
      } ),
      new ItemCreator( 'animal2', 4, ItemIcons.ANIMAL2_NODE, ItemIcons.ANIMAL2_SHADOW_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ 1 ]
      } ),
      new ItemCreator( 'animal3', 6, ItemIcons.ANIMAL3_NODE, ItemIcons.ANIMAL3_SHADOW_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ 2 ]
      } )
    ];
  }

  return inherit( BasicsScene, AnimalsScene );
} );
