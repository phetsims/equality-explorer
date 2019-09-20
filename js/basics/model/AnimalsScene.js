// Copyright 2017-2019, University of Colorado Boulder

/**
 * The 'Animals' scene in the 'Basics' screen.
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
  const catImage = require( 'image!EQUALITY_EXPLORER/cat.png' );
  const catShadowImage = require( 'image!EQUALITY_EXPLORER/catShadow.png' );
  const dogImage = require( 'image!EQUALITY_EXPLORER/dog.png' );
  const dogShadowImage = require( 'image!EQUALITY_EXPLORER/dogShadow.png' );
  const turtleImage = require( 'image!EQUALITY_EXPLORER/turtle.png' );
  const turtleShadowImage = require( 'image!EQUALITY_EXPLORER/turtleShadow.png' );

  /**
   * @constructor
   */
  function AnimalsScene() {

    const variables = [

      // name, image, shadow
      new ObjectVariable( 'dog', dogImage, dogShadowImage, { value: 11 } ),
      new ObjectVariable( 'cat', catImage, catShadowImage, { value: 4 } ),
      new ObjectVariable( 'turtle', turtleImage, turtleShadowImage, { value: 6 } )
    ];

    BasicsScene.call( this, variables, {

      debugName: 'animals',

      // icon used to represent this scene in the scene control (radio buttons)
      icon: new Image( turtleImage, {
        maxHeight: EqualityExplorerConstants.SMALL_TERM_DIAMETER
      } ),

      // weight at which the scale bottoms out
      maxWeight: 50
    } );
  }

  equalityExplorer.register( 'AnimalsScene', AnimalsScene );

  return inherit( BasicsScene, AnimalsScene );
} );
