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
  var Circle = require( 'SCENERY/nodes/Circle' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemCreator = require( 'EQUALITY_EXPLORER/common/model/ItemCreator' );

  //TODO replace these with animals artwork
  // Caution! These Nodes are reused via scenery's DAG feature. Do not attempt to transform them.
  var ANIMAL1_NODE = new Circle( EqualityExplorerConstants.ITEM_HEIGHT / 2, { fill: 'green' } );
  var ANIMAL2_NODE = new Circle( EqualityExplorerConstants.ITEM_HEIGHT / 2, { fill: 'orange' } );
  var ANIMAL3_NODE = new Circle( EqualityExplorerConstants.ITEM_HEIGHT / 2, { fill: 'magenta' } );

  /**
   * @constructor
   */
  function AnimalsScene() {
    BasicsScene.call( this, 'animals', ANIMAL1_NODE,
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
      new ItemCreator( 'animal1', 11, ANIMAL1_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ 0 ]
      } ),
      new ItemCreator( 'animal2', 4, ANIMAL2_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ 1 ]
      } ),
      new ItemCreator( 'animal3', 6, ANIMAL3_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ 2 ]
      } )
    ];
  }

  return inherit( BasicsScene, AnimalsScene );
} );
