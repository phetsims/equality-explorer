// Copyright 2017, University of Colorado Boulder

/**
 * The 'Shapes' scene in the 'Basics' screen.
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
  var IntegerNode = require( 'EQUALITY_EXPLORER/common/view/IntegerNode' );
  var ItemCreator = require( 'EQUALITY_EXPLORER/common/model/ItemCreator' );

  // images
  var sphereImage = require( 'image!EQUALITY_EXPLORER/sphere.png' );
  var squareImage = require( 'image!EQUALITY_EXPLORER/square.png' );

  // Caution! These Nodes that are reused via scenery's DAG feature. Do not attempt to transform them.
  var SPHERE_NODE = new Image( sphereImage, {
    maxHeight: EqualityExplorerConstants.ITEM_HEIGHT
  } );
  var SQUARE_NODE = new Image( squareImage, {
    maxHeight: EqualityExplorerConstants.ITEM_HEIGHT
  } );
  var ONE_NODE = new IntegerNode( 1, {
    radius: EqualityExplorerConstants.ITEM_HEIGHT / 2,
    fill: 'rgb( 246, 229, 214 )',
    maxHeight: EqualityExplorerConstants.ITEM_HEIGHT
  } );

  /**
   * @constructor
   */
  function ShapesScene() {
    BasicsScene.call( this, ONE_NODE,
      createItemCreators( EqualityExplorerQueryParameters.leftBasics ),
      createItemCreators( EqualityExplorerQueryParameters.rightBasics )
    );
  }

  equalityExplorer.register( 'ShapesScene', ShapesScene );

  /**
   * Creates the set of ItemCreators for this scene.
   * @param {number[]} numberOfItemsOnScale
   * @returns {ItemCreator[]}
   */
  function createItemCreators( numberOfItemsOnScale ) {
    assert && assert( numberOfItemsOnScale.length === 3 );
    return [
      new ItemCreator( 'sphere', 2, SPHERE_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ 0 ]
      } ),
      new ItemCreator( 'square', 3, SQUARE_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ 1 ]
      } ),
      new ItemCreator( '1', 1, ONE_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ 2 ],
        constantTerm: true
      } )
    ];
  }

  return inherit( BasicsScene, ShapesScene );
} );
