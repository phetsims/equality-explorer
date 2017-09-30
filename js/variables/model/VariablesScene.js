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
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemCreator = require( 'EQUALITY_EXPLORER/common/model/ItemCreator' );
  var ItemIcons = require( 'EQUALITY_EXPLORER/common/view/ItemIcons' );
  var Scene = require( 'EQUALITY_EXPLORER/common/model/Scene' );

  /**
   * @constructor
   */
  function VariablesScene() {
    Scene.call( this, 'variables',
      createItemCreators( EqualityExplorerQueryParameters.leftVariables ),
      createItemCreators( EqualityExplorerQueryParameters.rightVariables )
    );
  }

  equalityExplorer.register( 'VariablesScene', VariablesScene );

  /**
   * Creates the set of ItemCreators for this scene.
   * @param {number} numberOfItemsOnScale
   * @returns {ItemCreator[]}
   */
  function createItemCreators( numberOfItemsOnScale ) {
    assert && assert( numberOfItemsOnScale.length === 4 );
    return [
      new ItemCreator( 'x', 2, ItemIcons.POSITIVE_X_NODE, ItemIcons.X_SHADOW_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ 0 ],
        variableTerm: true
      } ),
      new ItemCreator( '-x', -2, ItemIcons.NEGATIVE_X_NODE, ItemIcons.X_SHADOW_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ 1 ],
        variableTerm: true
      } ),
      new ItemCreator( '1', 1, ItemIcons.POSITIVE_ONE_NODE, ItemIcons.ONE_SHADOW_NODE,{
        numberOfItemsOnScale: numberOfItemsOnScale[ 2 ],
        constantTerm: true
      } ),
      new ItemCreator( '-1', -1, ItemIcons.NEGATIVE_ONE_NODE, ItemIcons.ONE_SHADOW_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ 3 ],
        constantTerm: true
      } )
    ];
  }

  return inherit( Scene, VariablesScene );
} );
