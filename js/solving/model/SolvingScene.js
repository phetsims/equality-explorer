// Copyright 2017, University of Colorado Boulder

//TODO lots of duplication with VariablesScene
/**
 * The sole scene in the 'Solving' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerColors = require( 'EQUALITY_EXPLORER/common/EqualityExplorerColors' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var IntegerNode = require( 'EQUALITY_EXPLORER/common/view/IntegerNode' );
  var ItemCreator = require( 'EQUALITY_EXPLORER/common/model/ItemCreator' );
  var Scene = require( 'EQUALITY_EXPLORER/common/model/Scene' );
  var VariableNode = require( 'EQUALITY_EXPLORER/common/view/VariableNode' );

  // strings
  var xString = require( 'string!EQUALITY_EXPLORER/x' );

  // Caution! These Nodes that are reused via scenery's DAG feature. Do not attempt to transform them.
  var POSITIVE_X_NODE = new VariableNode( xString, {
    fill: EqualityExplorerColors.POSITIVE_X_FILL,
    maxHeight: EqualityExplorerConstants.ITEM_HEIGHT
  } );
  var NEGATIVE_X_NODE = new VariableNode( '-' + xString, {
    fill: EqualityExplorerColors.NEGATIVE_X_FILL,
    lineDash: [ 4, 4 ],
    maxHeight: EqualityExplorerConstants.ITEM_HEIGHT
  } );
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
  function SolvingScene() {
    Scene.call( this, 'solving', createItemCreators(), createItemCreators() );
  }

  equalityExplorer.register( 'SolvingScene', SolvingScene );

  /**
   * Creates the set of ItemCreators for this scene.
   * @returns {ItemCreator[]}
   */
  function createItemCreators() {
    return [
      new ItemCreator( 'x', 2, POSITIVE_X_NODE, { variableTerm: true } ),
      new ItemCreator( '-x', -2, NEGATIVE_X_NODE, { variableTerm: true } ),
      new ItemCreator( '1', 1, POSITIVE_ONE_NODE, { constantTerm: true } ),
      new ItemCreator( '-1', -1, NEGATIVE_ONE_NODE, { constantTerm: true } )
    ];
  }

  return inherit( Scene, SolvingScene );
} );
