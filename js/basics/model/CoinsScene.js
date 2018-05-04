// Copyright 2017-2018, University of Colorado Boulder

/**
 * The 'Coins' scene in the 'Basics' screen.
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
  var ObjectType = require( 'EQUALITY_EXPLORER/basics/model/ObjectType' );

  // images
  var coin1Image = require( 'image!EQUALITY_EXPLORER/coin1.png' );
  var coin1ShadowImage = require( 'image!EQUALITY_EXPLORER/coin1Shadow.png' );
  var coin2Image = require( 'image!EQUALITY_EXPLORER/coin2.png' );
  var coin2ShadowImage = require( 'image!EQUALITY_EXPLORER/coin2Shadow.png' );
  var coin3Image = require( 'image!EQUALITY_EXPLORER/coin3.png' );
  var coin3ShadowImage = require( 'image!EQUALITY_EXPLORER/coin3Shadow.png' );

  /**
   * @constructor
   */
  function CoinsScene() {

    var objectTypes = [

      // name, image, shadow, weight
      new ObjectType( 'coin1', coin1Image, coin1ShadowImage, 3 ),
      new ObjectType( 'coin2', coin2Image, coin2ShadowImage, 2 ),
      new ObjectType( 'coin3', coin3Image, coin3ShadowImage, 5 )
    ];

    BasicsScene.call( this, objectTypes, {

      debugName: 'coins',

      // icon used to represent this scene in the scene control (radio buttons)
      icon: new Image( coin3Image, {
        maxHeight: EqualityExplorerConstants.SMALL_TERM_DIAMETER
      } )
    } );
  }

  equalityExplorer.register( 'CoinsScene', CoinsScene );

  return inherit( BasicsScene, CoinsScene );
} );
