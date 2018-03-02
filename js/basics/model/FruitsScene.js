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
  var MysteryObject = require( 'EQUALITY_EXPLORER/basics/model/MysteryObject' );

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

    // icon that represents this scene
    var icon = new Image( appleImage, {
      maxHeight: EqualityExplorerConstants.SMALL_TERM_DIAMETER
    } );

    // mystery objects for this scene
    var mysteryObjects = [

      // name, weight, image, shadow
      new MysteryObject( 'apple', 4, appleImage, appleShadowImage ),
      new MysteryObject( 'lemon', 5, lemonImage, lemonShadowImage ),
      new MysteryObject( 'orange', 2, orangeImage, orangeShadowImage )
    ];

    BasicsScene.call( this, 'fruits', icon, mysteryObjects );
  }

  equalityExplorer.register( 'FruitsScene', FruitsScene );

  return inherit( BasicsScene, FruitsScene );
} );
