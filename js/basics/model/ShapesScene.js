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
  var ConstantItemCreator = require( 'EQUALITY_EXPLORER/common/model/ConstantItemCreator' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemIcons = require( 'EQUALITY_EXPLORER/common/view/ItemIcons' );
  var MysteryItemCreator = require( 'EQUALITY_EXPLORER/common/model/MysteryItemCreator' );

  /**
   * @constructor
   */
  function ShapesScene() {
    BasicsScene.call( this, 'shapes', ItemIcons.POSITIVE_ONE_NODE,
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
    var index = 0;
    return [
      new MysteryItemCreator( 2, ItemIcons.SPHERE_NODE, ItemIcons.SPHERE_SHADOW_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ index++ ]
      } ),
      new MysteryItemCreator( 3, ItemIcons.SQUARE_NODE, ItemIcons.SQUARE_SHADOW_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ index++ ]
      } ),
      new ConstantItemCreator( 1, ItemIcons.POSITIVE_ONE_NODE, ItemIcons.ONE_SHADOW_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ index++ ]
      } )
    ];
  }

  return inherit( BasicsScene, ShapesScene );
} );
