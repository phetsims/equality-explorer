// Copyright 2017-2018, University of Colorado Boulder

/**
 * The 'Animals' scene in the 'Basics' screen.
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
  var ObjectVariable = require( 'EQUALITY_EXPLORER/basics/model/ObjectVariable' );

  // images
  var catImage = require( 'image!EQUALITY_EXPLORER/cat.png' );
  var catShadowImage = require( 'image!EQUALITY_EXPLORER/catShadow.png' );
  var dogImage = require( 'image!EQUALITY_EXPLORER/dog.png' );
  var dogShadowImage = require( 'image!EQUALITY_EXPLORER/dogShadow.png' );
  var turtleImage = require( 'image!EQUALITY_EXPLORER/turtle.png' );
  var turtleShadowImage = require( 'image!EQUALITY_EXPLORER/turtleShadow.png' );

  /**
   * @constructor
   */
  function AnimalsScene() {

    var variables = [

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
