// Copyright 2017, University of Colorado Boulder

/**
 * The 'Spheres' scene in the 'Basics' screen.
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
  var ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );

  /**
   * @constructor
   */
  function SpheresScene() {

    // icons for each Item type
    var greenNode = new ShadedSphereNode( EqualityExplorerConstants.ITEM_HEIGHT, { mainColor: 'green' } );
    var orangeNode = new ShadedSphereNode( EqualityExplorerConstants.ITEM_HEIGHT, { mainColor: 'orange' } );
    var magentaNode = new ShadedSphereNode( EqualityExplorerConstants.ITEM_HEIGHT, { mainColor: 'magenta' } );

    var itemCreatorsIndex = 0;
    var leftItemCreators = [
      new ItemCreator( 'greenSphere', 3, greenNode, {
        numberOfItemsOnScale: EqualityExplorerQueryParameters.leftItems[ itemCreatorsIndex++ ]
      } ),
      new ItemCreator( 'orangeSphere', 2, orangeNode, {
        numberOfItemsOnScale: EqualityExplorerQueryParameters.leftItems[ itemCreatorsIndex++ ]
      } ),
      new ItemCreator( 'magentaSphere', 1, magentaNode, {
        numberOfItemsOnScale: EqualityExplorerQueryParameters.leftItems[ itemCreatorsIndex++ ]
      } )
    ];

    //TODO duplicate code
    itemCreatorsIndex = 0;
    var rightItemCreators = [
      new ItemCreator( 'greenSphere', 3, greenNode, {
        numberOfItemsOnScale: EqualityExplorerQueryParameters.leftItems[ itemCreatorsIndex++ ]
      } ),
      new ItemCreator( 'orangeSphere', 2, orangeNode, {
        numberOfItemsOnScale: EqualityExplorerQueryParameters.leftItems[ itemCreatorsIndex++ ]
      } ),
      new ItemCreator( 'magentaSphere', 1, magentaNode, {
        numberOfItemsOnScale: EqualityExplorerQueryParameters.leftItems[ itemCreatorsIndex++ ]
      } )
    ];

    BasicsScene.call( this, greenNode, leftItemCreators, rightItemCreators );
  }

  equalityExplorer.register( 'SpheresScene', SpheresScene );

  return inherit( BasicsScene, SpheresScene );
} );
