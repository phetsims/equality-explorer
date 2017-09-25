// Copyright 2017, University of Colorado Boulder

/**
 * The 'Spheres' scene in the 'Basics' screen.
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
  var ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );

  // Caution! These Nodes that are reused via scenery's DAG feature. Do not attempt to transform them.
  var GREEN_SPHERE_NODE = new ShadedSphereNode( EqualityExplorerConstants.ITEM_HEIGHT, { mainColor: 'green' } );
  var ORANGE_SPHERE_NODE = new ShadedSphereNode( EqualityExplorerConstants.ITEM_HEIGHT, { mainColor: 'orange' } );
  var MAGENTA_SPHERE_NODE = new ShadedSphereNode( EqualityExplorerConstants.ITEM_HEIGHT, { mainColor: 'magenta' } );

  /**
   * @constructor
   */
  function SpheresScene() {
    BasicsScene.call( this, GREEN_SPHERE_NODE,
      createItemCreators( EqualityExplorerQueryParameters.leftItems ),
      createItemCreators( EqualityExplorerQueryParameters.rightItems ) );
  }

  equalityExplorer.register( 'SpheresScene', SpheresScene );

  /**
   * Creates the set of ItemCreators for this scene.
   * @param {number[]} numberOfItemsOnScale
   * @returns {ItemCreator[]}
   */
  function createItemCreators( numberOfItemsOnScale ) {
    var itemCreatorsIndex = 0;
    return [
      new ItemCreator( 'greenSphere', 3, GREEN_SPHERE_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ itemCreatorsIndex++ ]
      } ),
      new ItemCreator( 'orangeSphere', 2, ORANGE_SPHERE_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ itemCreatorsIndex++ ]
      } ),
      new ItemCreator( 'magentaSphere', 1, MAGENTA_SPHERE_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ itemCreatorsIndex++ ]
      } )
    ];
  }

  return inherit( BasicsScene, SpheresScene );
} );
