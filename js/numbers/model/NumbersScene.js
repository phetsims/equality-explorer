// Copyright 2017, University of Colorado Boulder

/**
 * The sole scene in the 'Numbers' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerColors = require( 'EQUALITY_EXPLORER/common/EqualityExplorerColors' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var IntegerNode = require( 'EQUALITY_EXPLORER/common/view/IntegerNode' );
  var ItemCreator = require( 'EQUALITY_EXPLORER/common/model/ItemCreator' );
  var Scene = require( 'EQUALITY_EXPLORER/common/model/Scene' );

  // Caution! These Nodes that are reused via scenery's DAG feature. Do not attempt to transform them.
  var POSITIVE_ONE_NODE = new IntegerNode( 1, {
    radius: EqualityExplorerConstants.ITEM_HEIGHT / 2,
    fill: EqualityExplorerColors.POSITIVE_ONE_FILL,
    maxHeight: EqualityExplorerConstants.ITEM_HEIGHT
  } );
  var NEGATIVE_ONE_NODE = new IntegerNode( -1, {
    radius: EqualityExplorerConstants.ITEM_HEIGHT / 2,
    fill: EqualityExplorerColors.NEGATIVE_ONE_FILL,
    lineDash: [ 3, 3 ],
    maxHeight: EqualityExplorerConstants.ITEM_HEIGHT
  } );

  /**
   * @constructor
   */
  function NumbersScene() {
    Scene.call( this,
      createItemCreators( EqualityExplorerQueryParameters.leftNumbers ),
      createItemCreators( EqualityExplorerQueryParameters.rightNumbers )
    );
  }

  equalityExplorer.register( 'NumbersScene', NumbersScene );

  /**
   * Creates the set of ItemCreators for this scene.
   * @param {number} numberOfItemsOnScale
   * @returns {ItemCreator[]}
   */
  function createItemCreators( numberOfItemsOnScale ) {
    assert && assert( numberOfItemsOnScale.length === 2 );
    return [
      new ItemCreator( '1', 1, POSITIVE_ONE_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ 0 ],
        constantTerm: true
      } ),
      new ItemCreator( '-1', -1, NEGATIVE_ONE_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ 1 ],
        constantTerm: true
      } )
    ];
  }

  return inherit( Scene, NumbersScene );
} );
