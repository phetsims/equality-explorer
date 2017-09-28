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
  var SPHERE1_NODE = new ShadedSphereNode( EqualityExplorerConstants.ITEM_HEIGHT, { mainColor: 'green' } );
  var SPHERE2_NODE = new ShadedSphereNode( EqualityExplorerConstants.ITEM_HEIGHT, { mainColor: 'orange' } );
  var SPHERE3_NODE = new ShadedSphereNode( EqualityExplorerConstants.ITEM_HEIGHT, { mainColor: 'magenta' } );

  /**
   * @constructor
   */
  function SpheresScene() {
    BasicsScene.call( this, SPHERE1_NODE,
      createItemCreators( EqualityExplorerQueryParameters.leftBasics ),
      createItemCreators( EqualityExplorerQueryParameters.rightBasics )
    );
  }

  equalityExplorer.register( 'SpheresScene', SpheresScene );

  /**
   * Creates the set of ItemCreators for this scene.
   * @param {number[]} numberOfItemsOnScale
   * @returns {ItemCreator[]}
   */
  function createItemCreators( numberOfItemsOnScale ) {
    assert && assert( numberOfItemsOnScale.length === 3 );
    return [
      new ItemCreator( 'greenSphere', 3, SPHERE1_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ 0 ]
      } ),
      new ItemCreator( 'orangeSphere', 2, SPHERE2_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ 1 ]
      } ),
      new ItemCreator( 'magentaSphere', 1, SPHERE3_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ 2 ]
      } )
    ];
  }

  return inherit( BasicsScene, SpheresScene );
} );
