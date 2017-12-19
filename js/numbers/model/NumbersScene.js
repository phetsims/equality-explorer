// Copyright 2017, University of Colorado Boulder

/**
 * The sole scene in the 'Numbers' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ConstantItemCreator = require( 'EQUALITY_EXPLORER/common/model/ConstantItemCreator' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemIcons = require( 'EQUALITY_EXPLORER/common/view/ItemIcons' );
  var LockableScene = require( 'EQUALITY_EXPLORER/common/model/LockableScene' );

  /**
   * @constructor
   */
  function NumbersScene() {
    LockableScene.call( this, 'numbers',
      createItemCreators( EqualityExplorerQueryParameters.leftNumbers ),
      createItemCreators( EqualityExplorerQueryParameters.rightNumbers )
    );
  }

  equalityExplorer.register( 'NumbersScene', NumbersScene );

  /**
   * Creates the item creators for this scene.
   * @param {number} initialNumberOfItemsOnScale
   * @returns {AbstractItemCreator[]}
   */
  function createItemCreators( initialNumberOfItemsOnScale ) {
    assert && assert( initialNumberOfItemsOnScale.length === 2 );
    var index = 0;
    return [
      new ConstantItemCreator( ItemIcons.POSITIVE_ONE_NODE, ItemIcons.ONE_SHADOW_NODE, {
        weight: 1,
        initialNumberOfItemsOnScale: initialNumberOfItemsOnScale[ index++ ]
      } ),
      new ConstantItemCreator( ItemIcons.NEGATIVE_ONE_NODE, ItemIcons.ONE_SHADOW_NODE, {
        weight: -1,
        initialNumberOfItemsOnScale: initialNumberOfItemsOnScale[ index++ ]
      } )
    ];
  }

  return inherit( LockableScene, NumbersScene );
} );
