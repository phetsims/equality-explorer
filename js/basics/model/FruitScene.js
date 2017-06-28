// Copyright 2017, University of Colorado Boulder

/**
 * The 'Fruit' scene in the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BasicsScene = require( 'EQUALITY_EXPLORER/basics/model/BasicsScene' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemCreator = require( 'EQUALITY_EXPLORER/common/model/ItemCreator' );
  var NumberNode = require( 'EQUALITY_EXPLORER/common/view/NumberNode' );

  // images
  var appleImage = require( 'image!EQUALITY_EXPLORER/apple.png' );
  var orangeImage = require( 'image!EQUALITY_EXPLORER/orange.png' );

  /**
   * @constructor
   */
  function FruitScene() {

    // icons for each Item type, identical heights
    var oneNode = new NumberNode( 1, {
      radius: EqualityExplorerConstants.ITEM_RADIUS,
      fill: 'rgb( 246, 229, 214 )'
    } );
    var appleNode = new Image( appleImage, {
      maxHeight: oneNode.height
    } );
    var orangeNode = new Image( orangeImage, {
      maxHeight: oneNode.height
    } );

    var leftItemCreators = [
      new ItemCreator( 'apple', 3, appleNode ),
      new ItemCreator( 'orange', 2, orangeNode ),
      new ItemCreator( 'one', 1, oneNode, { constantTerm: true } )
    ];

    var rightItemCreators = [
      new ItemCreator( 'apple', 3, appleNode ),
      new ItemCreator( 'orange', 2, orangeNode ),
      new ItemCreator( 'one', 1, oneNode, { constantTerm: true } )
    ];

    BasicsScene.call( this, appleNode, leftItemCreators, rightItemCreators );
  }

  equalityExplorer.register( 'FruitScene', FruitScene );

  return inherit( BasicsScene, FruitScene );
} );
