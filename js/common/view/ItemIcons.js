// Copyright 2017, University of Colorado Boulder

/**
 * Item icons and their shadows.
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
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
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
  var ICON_HEIGHT = 32;
  var COMMON_OPTIONS = { maxHeight: ICON_HEIGHT };

  var ItemIcons = {

    ICON_HEIGHT: ICON_HEIGHT,

    // image-based icons and their shadows
    APPLE_NODE: new Image( appleImage, COMMON_OPTIONS ),
    APPLE_SHADOW_NODE: new Image( appleShadowImage, COMMON_OPTIONS ),

    CAT_NODE: new Image( catImage, COMMON_OPTIONS ),
    CAT_SHADOW_NODE: new Image( catShadowImage, COMMON_OPTIONS ),

    COIN1_NODE: new Image( coin1Image, COMMON_OPTIONS ),
    COIN1_SHADOW_NODE: new Image( coin1ShadowImage, COMMON_OPTIONS ),

    COIN2_NODE: new Image( coin2Image, COMMON_OPTIONS ),
    COIN2_SHADOW_NODE: new Image( coin2ShadowImage, COMMON_OPTIONS ),

    COIN3_NODE: new Image( coin3Image, COMMON_OPTIONS ),
    COIN3_SHADOW_NODE: new Image( coin3ShadowImage, COMMON_OPTIONS ),

    DOG_NODE: new Image( dogImage, COMMON_OPTIONS ),
    DOG_SHADOW_NODE: new Image( dogShadowImage, COMMON_OPTIONS ),

    LEMON_NODE: new Image( lemonImage, COMMON_OPTIONS ),
    LEMON_SHADOW_NODE: new Image( lemonShadowImage, COMMON_OPTIONS ),

    ORANGE_NODE: new Image( orangeImage, COMMON_OPTIONS ),
    ORANGE_SHADOW_NODE: new Image( orangeShadowImage, COMMON_OPTIONS ),

    SPHERE_NODE: new Image( sphereImage, COMMON_OPTIONS ),
    SPHERE_SHADOW_NODE: new Image( sphereShadowImage, COMMON_OPTIONS ),

    SQUARE_NODE: new Image( squareImage, COMMON_OPTIONS ),
    SQUARE_SHADOW_NODE: new Image( squareShadowImage, COMMON_OPTIONS ),

    TURTLE_NODE: new Image( turtleImage, COMMON_OPTIONS ),
    TURTLE_SHADOW_NODE: new Image( turtleShadowImage, COMMON_OPTIONS ),

    // 1, -1 and their shadow
    POSITIVE_ONE_NODE: new IntegerNode( 1, _.extend( {}, {
      radius: ICON_HEIGHT / 2,
      fill: EqualityExplorerConstants.POSITIVE_CONSTANT_FILL,
      lineDash: EqualityExplorerConstants.POSITIVE_CONSTANT_LINE_DASH
    }, COMMON_OPTIONS ) ),
    NEGATIVE_ONE_NODE: new IntegerNode( -1, _.extend( {}, {
      radius: ICON_HEIGHT / 2,
      fill: EqualityExplorerConstants.NEGATIVE_CONSTANT_FILL,
      lineDash: EqualityExplorerConstants.NEGATIVE_CONSTANT_LINE_DASH
    }, COMMON_OPTIONS ) ),
    ONE_SHADOW_NODE: new Circle( ICON_HEIGHT / 2, _.extend( {}, {
      fill: 'black'
    }, COMMON_OPTIONS ) ),

    // x, -x and their shadow
    POSITIVE_X_NODE: new VariableNode( xString, _.extend( {}, {
      fill: EqualityExplorerConstants.POSITIVE_X_FILL,
      lineDash: EqualityExplorerConstants.POSITIVE_VARIABLE_LINE_DASH
    }, COMMON_OPTIONS ) ),
    NEGATIVE_X_NODE: new VariableNode( '-' + xString, _.extend( {}, {
      fill: EqualityExplorerConstants.NEGATIVE_X_FILL,
      lineDash: EqualityExplorerConstants.NEGATIVE_VARIABLE_LINE_DASH
    }, COMMON_OPTIONS ) ),
    X_SHADOW_NODE: new Rectangle( 0, 0, ICON_HEIGHT, ICON_HEIGHT, _.extend( {}, {
      fill: 'black'
    }, COMMON_OPTIONS ) )
  };

  equalityExplorer.register( 'ItemIcons', ItemIcons );

  return ItemIcons;
} );
