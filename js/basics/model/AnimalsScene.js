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

    // icon that represents this scene
    var icon = new Image( turtleImage, {
      maxHeight: EqualityExplorerConstants.SMALL_TERM_DIAMETER
    } );

    // mystery objects for this scene
    var animals = [
      { name: 'dog', weight: 11, icon: dogImage, shadow: dogShadowImage },
      { name: 'cat', weight: 4, icon: catImage, shadow: catShadowImage },
      { name: 'turtle', weight: 6, icon: turtleImage, shadow: turtleShadowImage }
    ];

    BasicsScene.call( this, 'animals', icon, animals, {
      maxWeight: 50 // weight at which the scale bottoms out
    } );
  }

  equalityExplorer.register( 'AnimalsScene', AnimalsScene );

  return inherit( BasicsScene, AnimalsScene );
} );
