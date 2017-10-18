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
    BasicsScene.call( this, 'animals', ItemIcons.TURTLE_NODE,
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
      new ItemCreator( 'dog', 11, ItemIcons.DOG_NODE, ItemIcons.DOG_SHADOW_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ 0 ]
      } ),
      new ItemCreator( 'turtle', 4, ItemIcons.TURTLE_NODE, ItemIcons.TURTLE_SHADOW_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ 2 ]
      } ),
      new ItemCreator( 'cat', 6, ItemIcons.CAT_NODE, ItemIcons.CAT_SHADOW_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ 1 ]
      } )
    ];
  }

  return inherit( BasicsScene, AnimalsScene );
} );
