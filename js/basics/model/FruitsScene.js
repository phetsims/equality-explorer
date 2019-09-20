// Copyright 2017-2019, University of Colorado Boulder

/**
 * The 'Fruits' scene in the 'Basics' screen.
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
  const appleImage = require( 'image!EQUALITY_EXPLORER/apple.png' );
  const appleShadowImage = require( 'image!EQUALITY_EXPLORER/appleShadow.png' );
  const lemonImage = require( 'image!EQUALITY_EXPLORER/lemon.png' );
  const lemonShadowImage = require( 'image!EQUALITY_EXPLORER/lemonShadow.png' );
  const orangeImage = require( 'image!EQUALITY_EXPLORER/orange.png' );
  const orangeShadowImage = require( 'image!EQUALITY_EXPLORER/orangeShadow.png' );

  /**
   * @constructor
   */
  function FruitsScene() {

    const variables = [

      // name, image, shadow
      new ObjectVariable( 'apple', appleImage, appleShadowImage, { value: 4 } ),
      new ObjectVariable( 'lemon', lemonImage, lemonShadowImage, { value: 5 } ),
      new ObjectVariable( 'orange', orangeImage, orangeShadowImage, { value: 2 } )
    ];

    BasicsScene.call( this, variables, {

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
