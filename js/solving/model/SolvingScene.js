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
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemCreator = require( 'EQUALITY_EXPLORER/common/model/ItemCreator' );
  var ItemIcons = require( 'EQUALITY_EXPLORER/common/view/ItemIcons' );
  var Scene = require( 'EQUALITY_EXPLORER/common/model/Scene' );

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
      new ItemCreator( 'x', 2, ItemIcons.POSITIVE_X_NODE, ItemIcons.X_SHADOW_NODE, { variableTerm: true } ),
      new ItemCreator( '-x', -2, ItemIcons.NEGATIVE_X_NODE, ItemIcons.X_SHADOW_NODE, { variableTerm: true } ),
      new ItemCreator( '1', 1, ItemIcons.POSITIVE_ONE_NODE, ItemIcons.ONE_SHADOW_NODE, { constantTerm: true } ),
      new ItemCreator( '-1', -1, ItemIcons.NEGATIVE_ONE_NODE, ItemIcons.ONE_SHADOW_NODE, { constantTerm: true } )
    ];
  }

  return inherit( Scene, SolvingScene );
} );
