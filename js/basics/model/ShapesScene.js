// Copyright 2017-2018, University of Colorado Boulder

/**
 * The 'Shapes' scene in the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BasicsScene = require( 'EQUALITY_EXPLORER/basics/model/BasicsScene' );
  var ConstantTermNode = require( 'EQUALITY_EXPLORER/common/view/ConstantTermNode' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var Fraction = require( 'PHETCOMMON/model/Fraction' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ObjectType = require( 'EQUALITY_EXPLORER/basics/model/ObjectType' );

  // images
  var sphereImage = require( 'image!EQUALITY_EXPLORER/sphere.png' );
  var sphereShadowImage = require( 'image!EQUALITY_EXPLORER/sphereShadow.png' );
  var squareImage = require( 'image!EQUALITY_EXPLORER/square.png' );
  var squareShadowImage = require( 'image!EQUALITY_EXPLORER/squareShadow.png' );

  /**
   * @constructor
   */
  function ShapesScene() {

    var objectTypes = [

      // name, image, shadow, weight
      new ObjectType( 'sphere', sphereImage, sphereShadowImage, 2 ),
      new ObjectType( 'square', squareImage, squareShadowImage, 3 )
    ];

    BasicsScene.call( this, objectTypes, {

      debugName: 'shapes',

      // icon used to represent this scene in the scene control (radio buttons)
      icon: ConstantTermNode.createInteractiveTermNode( Fraction.fromInteger( 1 ) ),

      // this scene allows you to create constant terms
      hasConstantTerms: true
    } );
  }

  equalityExplorer.register( 'ShapesScene', ShapesScene );

  return inherit( BasicsScene, ShapesScene );
} );
