// Copyright 2017, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var Image = require( 'SCENERY/nodes/Image' );
  var IntegerNode = require( 'EQUALITY_EXPLORER/common/view/IntegerNode' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var VariableNode = require( 'EQUALITY_EXPLORER/common/view/VariableNode' );

  // images
  var appleImage = require( 'image!EQUALITY_EXPLORER/apple.png' );
  var appleShadowImage = require( 'image!EQUALITY_EXPLORER/appleShadow.png' );
  var coin1Image = require( 'image!EQUALITY_EXPLORER/coin1.png' );
  var coin1ShadowImage = require( 'image!EQUALITY_EXPLORER/coin1Shadow.png' );
  var coin2Image = require( 'image!EQUALITY_EXPLORER/coin2.png' );
  var coin2ShadowImage = require( 'image!EQUALITY_EXPLORER/coin2Shadow.png' );
  var coin3Image = require( 'image!EQUALITY_EXPLORER/coin3.png' );
  var coin3ShadowImage = require( 'image!EQUALITY_EXPLORER/coin3Shadow.png' );
  var lemonImage = require( 'image!EQUALITY_EXPLORER/lemon.png' );
  var lemonShadowImage = require( 'image!EQUALITY_EXPLORER/lemonShadow.png' );
  var orangeImage = require( 'image!EQUALITY_EXPLORER/orange.png' );
  var orangeShadowImage = require( 'image!EQUALITY_EXPLORER/orangeShadow.png' );
  var sphereImage = require( 'image!EQUALITY_EXPLORER/sphere.png' );
  var sphereShadowImage = require( 'image!EQUALITY_EXPLORER/sphereShadow.png' );
  var squareImage = require( 'image!EQUALITY_EXPLORER/square.png' );
  var squareShadowImage = require( 'image!EQUALITY_EXPLORER/squareShadow.png' );

  // strings
  var xString = require( 'string!EQUALITY_EXPLORER/x' );

  // constants
  var ITEM_HEIGHT = 32;
  var IMAGE_OPTIONS = { maxHeight: ITEM_HEIGHT };

  var EqualityExplorerConstants = {

    SCREEN_VIEW_LAYOUT_BOUNDS: new Bounds2( 0, 0, 1024, 618 ),

    SCREEN_VIEW_X_MARGIN: 20,
    SCREEN_VIEW_Y_MARGIN: 20,

    PLUS: '\u002b',
    MINUS: '\u2212',
    TIMES: '\u00d7',
    DIVIDE: '\u00f7',

    //TODO move these reusable images to a different file?
    // Caution! These Nodes are reused via scenery's DAG feature.
    // Do not attempt to transform them direct. Wrap them in a parent Node and transform the parent.
    APPLE_NODE: new Image( appleImage, IMAGE_OPTIONS ),
    APPLE_SHADOW_NODE: new Image( appleShadowImage, IMAGE_OPTIONS ),

    ANIMAL1_NODE: new Circle( ITEM_HEIGHT / 2, { fill: 'green', stroke: 'black' } ),
    ANIMAL1_SHADOW_NODE: new Circle( ITEM_HEIGHT / 2, { fill: 'black' } ),

    ANIMAL2_NODE: new Circle( ITEM_HEIGHT / 2, { fill: 'cyan', stroke: 'black' } ),
    ANIMAL2_SHADOW_NODE: new Circle( ITEM_HEIGHT / 2, { fill: 'black' } ),

    ANIMAL3_NODE: new Circle( ITEM_HEIGHT / 2, { fill: 'magenta', stroke: 'black' } ),
    ANIMAL3_SHADOW_NODE: new Circle( ITEM_HEIGHT / 2, { fill: 'black' } ),

    COIN1_NODE: new Image( coin1Image, IMAGE_OPTIONS ),
    COIN1_SHADOW_NODE: new Image( coin1ShadowImage, IMAGE_OPTIONS ),

    COIN2_NODE: new Image( coin2Image, IMAGE_OPTIONS ),
    COIN2_SHADOW_NODE: new Image( coin2ShadowImage, IMAGE_OPTIONS ),

    COIN3_NODE: new Image( coin3Image, IMAGE_OPTIONS ),
    COIN3_SHADOW_NODE: new Image( coin3ShadowImage, IMAGE_OPTIONS ),

    LEMON_NODE: new Image( lemonImage, IMAGE_OPTIONS ),
    LEMON_SHADOW_NODE: new Image( lemonShadowImage, IMAGE_OPTIONS ),

    ORANGE_NODE: new Image( orangeImage, IMAGE_OPTIONS ),
    ORANGE_SHADOW_NODE: new Image( orangeShadowImage, IMAGE_OPTIONS ),

    SPHERE_NODE: new Image( sphereImage, IMAGE_OPTIONS ),
    SPHERE_SHADOW_NODE: new Image( sphereShadowImage, IMAGE_OPTIONS ),

    SQUARE_NODE: new Image( squareImage, IMAGE_OPTIONS ),
    SQUARE_SHADOW_NODE: new Image( squareShadowImage, IMAGE_OPTIONS ),

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
    })
  };

  equalityExplorer.register( 'EqualityExplorerConstants', EqualityExplorerConstants );

  return EqualityExplorerConstants;
} );
