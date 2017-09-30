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
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemCreator = require( 'EQUALITY_EXPLORER/common/model/ItemCreator' );
  var ItemIcons = require( 'EQUALITY_EXPLORER/common/view/ItemIcons' );

  /**
   * @constructor
   */
  function ShapesScene() {
    BasicsScene.call( this, 'shapes', ItemIcons.POSITIVE_ONE_NODE,
      createItemCreators( EqualityExplorerQueryParameters.leftBasics ),
      createItemCreators( EqualityExplorerQueryParameters.rightBasics ) );
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
      new ItemCreator( 'sphere', 2, ItemIcons.SPHERE_NODE, ItemIcons.SPHERE_SHADOW_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ 0 ]
      } ),
      new ItemCreator( 'square', 3, ItemIcons.SQUARE_NODE, ItemIcons.SQUARE_SHADOW_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ 1 ]
      } ),
      new ItemCreator( '1', 1, ItemIcons.POSITIVE_ONE_NODE, ItemIcons.ONE_SHADOW_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ 2 ],
        constantTerm: true
      } )
    ];
  }

  return inherit( BasicsScene, ShapesScene );
} );
