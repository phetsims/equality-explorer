// Copyright 2017-2018, University of Colorado Boulder

/**
 * The 'Fruits' scene in the 'Basics' screen.
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
  var appleImage = require( 'image!EQUALITY_EXPLORER/apple.png' );
  var appleShadowImage = require( 'image!EQUALITY_EXPLORER/appleShadow.png' );
  var lemonImage = require( 'image!EQUALITY_EXPLORER/lemon.png' );
  var lemonShadowImage = require( 'image!EQUALITY_EXPLORER/lemonShadow.png' );
  var orangeImage = require( 'image!EQUALITY_EXPLORER/orange.png' );
  var orangeShadowImage = require( 'image!EQUALITY_EXPLORER/orangeShadow.png' );

  /**
   * @constructor
   */
  function FruitsScene() {

    var objectTypes = [

      // name, image, shadow, weight
      new ObjectType( 'apple', appleImage, appleShadowImage, 4 ),
      new ObjectType( 'lemon', lemonImage, lemonShadowImage, 5 ),
      new ObjectType( 'orange', orangeImage, orangeShadowImage, 2 )
    ];

    BasicsScene.call( this, objectTypes, {

      debugName: 'fruits',

      // icon used to represent this scene in the scene control (radio buttons)
      icon: new Image( appleImage, {
        maxHeight: EqualityExplorerConstants.SMALL_TERM_DIAMETER
      } )
    } );
  }

  equalityExplorer.register( 'FruitsScene', FruitsScene );

  return inherit( BasicsScene, FruitsScene );
} );
