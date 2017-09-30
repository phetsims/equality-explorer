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
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemCreator = require( 'EQUALITY_EXPLORER/common/model/ItemCreator' );
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
      new ItemCreator( 'x', 2, EqualityExplorerConstants.POSITIVE_X_NODE, EqualityExplorerConstants.X_SHADOW_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ 0 ],
        variableTerm: true
      } ),
      new ItemCreator( '-x', -2, EqualityExplorerConstants.NEGATIVE_X_NODE, EqualityExplorerConstants.X_SHADOW_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ 1 ],
        variableTerm: true
      } ),
      new ItemCreator( '1', 1, EqualityExplorerConstants.POSITIVE_ONE_NODE, EqualityExplorerConstants.ONE_SHADOW_NODE,{
        numberOfItemsOnScale: numberOfItemsOnScale[ 2 ],
        constantTerm: true
      } ),
      new ItemCreator( '-1', -1, EqualityExplorerConstants.NEGATIVE_ONE_NODE, EqualityExplorerConstants.ONE_SHADOW_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ 3 ],
        constantTerm: true
      } )
    ];
  }

  return inherit( Scene, VariablesScene );
} );
