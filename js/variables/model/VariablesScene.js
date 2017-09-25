// Copyright 2017, University of Colorado Boulder

/**
 * The sole scene in the 'Variables' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var IntegerNode = require( 'EQUALITY_EXPLORER/common/view/IntegerNode' );
  var ItemCreator = require( 'EQUALITY_EXPLORER/common/model/ItemCreator' );
  var Scene = require( 'EQUALITY_EXPLORER/common/model/Scene' );

  // Caution! These Nodes that are reused via scenery's DAG feature. Do not attempt to transform them.
  var POSITIVE_ONE_NODE = new IntegerNode( 1, {
    radius: EqualityExplorerConstants.ITEM_HEIGHT / 2,
    fill: 'rgb( 246, 229, 214 )',
    maxHeight: EqualityExplorerConstants.ITEM_HEIGHT
  } );
  var NEGATIVE_ONE_NODE = new IntegerNode( -1, {
    radius: EqualityExplorerConstants.ITEM_HEIGHT / 2,
    fill: 'rgb( 246, 229, 214 )',
    lineDash: [ 3, 3 ],
    maxHeight: EqualityExplorerConstants.ITEM_HEIGHT
  } );

  /**
   * @constructor
   */
  function VariablesScene() {
    Scene.call( this, createItemCreators(), createItemCreators() );
  }

  equalityExplorer.register( 'VariablesScene', VariablesScene );

  /**
   * Creates the set of ItemCreators for this scene.
   * @returns {ItemCreator[]}
   */
  function createItemCreators() {
    return [
      new ItemCreator( '1', 1, POSITIVE_ONE_NODE, { constantTerm: true } ),
      new ItemCreator( '-1', -1, NEGATIVE_ONE_NODE, { constantTerm: true } )
    ];
  }

  return inherit( Scene, VariablesScene );
} );
