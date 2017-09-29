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
  var VariableNode = require( 'EQUALITY_EXPLORER/common/view/VariableNode' );

  // images
  var sphereImage = require( 'image!EQUALITY_EXPLORER/sphere.png' );
  var squareImage = require( 'image!EQUALITY_EXPLORER/square.png' );
  var appleImage = require( 'image!EQUALITY_EXPLORER/apple.png' );
  var lemonImage = require( 'image!EQUALITY_EXPLORER/lemon.png' );
  var orangeImage = require( 'image!EQUALITY_EXPLORER/orange.png' );
  var coin1Image = require( 'image!EQUALITY_EXPLORER/coin1.png' );
  var coin2Image = require( 'image!EQUALITY_EXPLORER/coin2.png' );
  var coin3Image = require( 'image!EQUALITY_EXPLORER/coin3.png' );

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

    // Caution! These Nodes are reused via scenery's DAG feature.
    // Do not attempt to transform them direct. Wrap them in a parent Node and transform the parent.
    SPHERE_NODE: new Image( sphereImage, IMAGE_OPTIONS ),
    SQUARE_NODE: new Image( squareImage, IMAGE_OPTIONS ),
    APPLE_NODE: new Image( appleImage, IMAGE_OPTIONS ),
    ORANGE_NODE: new Image( orangeImage, IMAGE_OPTIONS ),
    LEMON_NODE: new Image( lemonImage, IMAGE_OPTIONS ),
    COIN1_NODE: new Image( coin1Image, IMAGE_OPTIONS ),
    COIN2_NODE: new Image( coin2Image, IMAGE_OPTIONS ),
    COIN3_NODE: new Image( coin3Image, IMAGE_OPTIONS ),
    ANIMAL1_NODE: new Circle( ITEM_HEIGHT / 2, { fill: 'green', stroke: 'black' } ),
    ANIMAL2_NODE: new Circle( ITEM_HEIGHT / 2, { fill: 'cyan', stroke: 'black' } ),
    ANIMAL3_NODE: new Circle( ITEM_HEIGHT / 2, { fill: 'magenta', stroke: 'black' } ),
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
    POSITIVE_X_NODE: new VariableNode( xString, {
      fill: 'rgb( 49, 193, 238 )',
      maxHeight: ITEM_HEIGHT
    } ),
     NEGATIVE_X_NODE: new VariableNode( '-' + xString, {
      fill: 'rgb( 99, 212, 238 )',
      lineDash: [ 4, 4 ],
      maxHeight: ITEM_HEIGHT
    } )
  };

  equalityExplorer.register( 'EqualityExplorerConstants', EqualityExplorerConstants );

  return EqualityExplorerConstants;
} );
