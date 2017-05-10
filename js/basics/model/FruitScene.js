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

    // icons for each Item type
    var appleNode = new Image( appleImage );
    var orangeNode = new Image( orangeImage );
    var oneNode = new NumberNode( 1, {
      radius: EqualityExplorerConstants.ITEM_RADIUS,
      fill: 'rgb( 246, 229, 214 )'
    } );

    //TODO temporary? scale icons to have identical dimensions
    appleNode.setScaleMagnitude( oneNode.width / appleNode.width, oneNode.height / appleNode.height );
    orangeNode.setScaleMagnitude( oneNode.width / orangeNode.width, oneNode.height / orangeNode.height );

    var itemCreators = [
      new ItemCreator( 3, appleNode ),
      new ItemCreator( 2, orangeNode ),
      new ItemCreator( 1, oneNode )
    ];

    BasicsScene.call( this, appleNode, itemCreators );
  }

  equalityExplorer.register( 'FruitScene', FruitScene );

  return inherit( BasicsScene, FruitScene );
} );
