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
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemCreator = require( 'EQUALITY_EXPLORER/common/model/ItemCreator' );

  /**
   * @constructor
   */
  function ShapesScene() {
    BasicsScene.call( this, 'shapes', EqualityExplorerConstants.POSITIVE_ONE_NODE,
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
      new ItemCreator( 'sphere', 2, EqualityExplorerConstants.SPHERE_NODE, EqualityExplorerConstants.SPHERE_SHADOW_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ 0 ]
      } ),
      new ItemCreator( 'square', 3, EqualityExplorerConstants.SQUARE_NODE, EqualityExplorerConstants.SQUARE_SHADOW_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ 1 ]
      } ),
      new ItemCreator( '1', 1, EqualityExplorerConstants.POSITIVE_ONE_NODE, EqualityExplorerConstants.ONE_SHADOW_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ 2 ],
        constantTerm: true
      } )
    ];
  }

  return inherit( BasicsScene, ShapesScene );
} );
