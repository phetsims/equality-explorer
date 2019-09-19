// Copyright 2017-2018, University of Colorado Boulder

/**
 * The 'Coins' scene in the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BasicsScene = require( 'EQUALITY_EXPLORER/basics/model/BasicsScene' );
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const ObjectVariable = require( 'EQUALITY_EXPLORER/basics/model/ObjectVariable' );

  // images
  const coin1Image = require( 'image!EQUALITY_EXPLORER/coin1.png' );
  const coin1ShadowImage = require( 'image!EQUALITY_EXPLORER/coin1Shadow.png' );
  const coin2Image = require( 'image!EQUALITY_EXPLORER/coin2.png' );
  const coin2ShadowImage = require( 'image!EQUALITY_EXPLORER/coin2Shadow.png' );
  const coin3Image = require( 'image!EQUALITY_EXPLORER/coin3.png' );
  const coin3ShadowImage = require( 'image!EQUALITY_EXPLORER/coin3Shadow.png' );

  /**
   * @constructor
   */
  function CoinsScene() {

    var variables = [

      // name, image, shadow
      new ObjectVariable( 'coin1', coin1Image, coin1ShadowImage, { value: 3 } ),
      new ObjectVariable( 'coin2', coin2Image, coin2ShadowImage, { value: 2 } ),
      new ObjectVariable( 'coin3', coin3Image, coin3ShadowImage, { value: 5 } )
    ];

    BasicsScene.call( this, variables, {

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
