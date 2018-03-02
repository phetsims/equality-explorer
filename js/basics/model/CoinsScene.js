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

    // icon that represents this scene
    var icon = new Image( coin3Image, {
      maxHeight: EqualityExplorerConstants.SMALL_TERM_DIAMETER
    } );

    // mystery objects for this scene
    var coins = [
      { name: 'coin1', weight: 3, icon: coin1Image, shadow: coin1ShadowImage },
      { name: 'coin2', weight: 2, icon: coin2Image, shadow: coin2ShadowImage },
      { name: 'coin3', weight: 5, icon: coin3Image, shadow: coin3ShadowImage }
    ];

    BasicsScene.call( this, 'coins', icon, coins );
  }

  equalityExplorer.register( 'CoinsScene', CoinsScene );

  return inherit( BasicsScene, CoinsScene );
} );
