// Copyright 2017, University of Colorado Boulder

/**
 * Items icons and their shadows.
 * Caution! These Nodes are reused via scenery's DAG feature.
 * Do not attempt to transform them direct. Wrap them in a parent Node and transform the parent.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var Image = require( 'SCENERY/nodes/Image' );
  var IntegerNode = require( 'EQUALITY_EXPLORER/common/view/IntegerNode' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var VariableNode = require( 'EQUALITY_EXPLORER/common/view/VariableNode' );

  // images
  var appleImage = require( 'image!EQUALITY_EXPLORER/apple.png' );
  var appleShadowImage = require( 'image!EQUALITY_EXPLORER/appleShadow.png' );
  var catImage = require( 'image!EQUALITY_EXPLORER/cat.png' );
  var catShadowImage = require( 'image!EQUALITY_EXPLORER/catShadow.png' );
  var coin1Image = require( 'image!EQUALITY_EXPLORER/coin1.png' );
  var coin1ShadowImage = require( 'image!EQUALITY_EXPLORER/coin1Shadow.png' );
  var coin2Image = require( 'image!EQUALITY_EXPLORER/coin2.png' );
  var coin2ShadowImage = require( 'image!EQUALITY_EXPLORER/coin2Shadow.png' );
  var coin3Image = require( 'image!EQUALITY_EXPLORER/coin3.png' );
  var coin3ShadowImage = require( 'image!EQUALITY_EXPLORER/coin3Shadow.png' );
  var dogImage = require( 'image!EQUALITY_EXPLORER/dog.png' );
  var dogShadowImage = require( 'image!EQUALITY_EXPLORER/dogShadow.png' );
  var lemonImage = require( 'image!EQUALITY_EXPLORER/lemon.png' );
  var lemonShadowImage = require( 'image!EQUALITY_EXPLORER/lemonShadow.png' );
  var orangeImage = require( 'image!EQUALITY_EXPLORER/orange.png' );
  var orangeShadowImage = require( 'image!EQUALITY_EXPLORER/orangeShadow.png' );
  var sphereImage = require( 'image!EQUALITY_EXPLORER/sphere.png' );
  var sphereShadowImage = require( 'image!EQUALITY_EXPLORER/sphereShadow.png' );
  var squareImage = require( 'image!EQUALITY_EXPLORER/square.png' );
  var squareShadowImage = require( 'image!EQUALITY_EXPLORER/squareShadow.png' );
  var turtleImage = require( 'image!EQUALITY_EXPLORER/turtle.png' );
  var turtleShadowImage = require( 'image!EQUALITY_EXPLORER/turtleShadow.png' );

  // strings
  var xString = require( 'string!EQUALITY_EXPLORER/x' );

  // constants
  var ITEM_HEIGHT = 32;
  var IMAGE_OPTIONS = { maxHeight: ITEM_HEIGHT };

  var ItemIcons = {

    APPLE_NODE: new Image( appleImage, IMAGE_OPTIONS ),
    APPLE_SHADOW_NODE: new Image( appleShadowImage, IMAGE_OPTIONS ),

    CAT_NODE: new Image( catImage, IMAGE_OPTIONS ),
    CAT_SHADOW_NODE: new Image( catShadowImage, IMAGE_OPTIONS ),

    COIN1_NODE: new Image( coin1Image, IMAGE_OPTIONS ),
    COIN1_SHADOW_NODE: new Image( coin1ShadowImage, IMAGE_OPTIONS ),

    COIN2_NODE: new Image( coin2Image, IMAGE_OPTIONS ),
    COIN2_SHADOW_NODE: new Image( coin2ShadowImage, IMAGE_OPTIONS ),

    COIN3_NODE: new Image( coin3Image, IMAGE_OPTIONS ),
    COIN3_SHADOW_NODE: new Image( coin3ShadowImage, IMAGE_OPTIONS ),

    DOG_NODE: new Image( dogImage, IMAGE_OPTIONS ),
    DOG_SHADOW_NODE: new Image( dogShadowImage, IMAGE_OPTIONS ),

    LEMON_NODE: new Image( lemonImage, IMAGE_OPTIONS ),
    LEMON_SHADOW_NODE: new Image( lemonShadowImage, IMAGE_OPTIONS ),

    ORANGE_NODE: new Image( orangeImage, IMAGE_OPTIONS ),
    ORANGE_SHADOW_NODE: new Image( orangeShadowImage, IMAGE_OPTIONS ),

    SPHERE_NODE: new Image( sphereImage, IMAGE_OPTIONS ),
    SPHERE_SHADOW_NODE: new Image( sphereShadowImage, IMAGE_OPTIONS ),

    SQUARE_NODE: new Image( squareImage, IMAGE_OPTIONS ),
    SQUARE_SHADOW_NODE: new Image( squareShadowImage, IMAGE_OPTIONS ),

    TURTLE_NODE: new Image( turtleImage, IMAGE_OPTIONS ),
    TURTLE_SHADOW_NODE: new Image( turtleShadowImage, IMAGE_OPTIONS ),

    POSITIVE_ONE_NODE: new IntegerNode( 1, {
      radius: ITEM_HEIGHT / 2,
      fill: 'rgb( 246, 228, 213 )',
      maxHeight: ITEM_HEIGHT
    } ),
    NEGATIVE_ONE_NODE: new IntegerNode( -1, {
      radius: ITEM_HEIGHT / 2,
      fill: 'rgb( 248, 238, 229 )',
      lineDash: [ 3, 3 ],
      maxHeight: ITEM_HEIGHT
    } ),
    ONE_SHADOW_NODE: new Circle( ITEM_HEIGHT / 2, {
      fill: 'black',
      maxHeight: ITEM_HEIGHT
    } ),

    POSITIVE_X_NODE: new VariableNode( xString, {
      fill: 'rgb( 49, 193, 238 )',
      maxHeight: ITEM_HEIGHT
    } ),
    NEGATIVE_X_NODE: new VariableNode( '-' + xString, {
      fill: 'rgb( 99, 212, 238 )',
      lineDash: [ 4, 4 ],
      maxHeight: ITEM_HEIGHT
    } ),
    X_SHADOW_NODE: new Rectangle( 0, 0, ITEM_HEIGHT, ITEM_HEIGHT, {
      fill: 'black',
      maxHeight: ITEM_HEIGHT
    } )
  };

  equalityExplorer.register( 'ItemIcons', ItemIcons );

  return ItemIcons;
} );
