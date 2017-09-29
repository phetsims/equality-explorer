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
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemCreator = require( 'EQUALITY_EXPLORER/common/model/ItemCreator' );
  var Scene = require( 'EQUALITY_EXPLORER/common/model/Scene' );

  /**
   * @constructor
   */
  function NumbersScene() {
    Scene.call( this, 'numbers',
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
      new ItemCreator( '1', 1, EqualityExplorerConstants.POSITIVE_ONE_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ 0 ],
        constantTerm: true
      } ),
      new ItemCreator( '-1', -1, EqualityExplorerConstants.NEGATIVE_ONE_NODE, {
        numberOfItemsOnScale: numberOfItemsOnScale[ 1 ],
        constantTerm: true
      } )
    ];
  }

  return inherit( Scene, NumbersScene );
} );
