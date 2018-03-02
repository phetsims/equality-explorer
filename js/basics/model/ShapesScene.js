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
  var inherit = require( 'PHET_CORE/inherit' );
  var ReducedFraction = require( 'EQUALITY_EXPLORER/common/model/ReducedFraction' );
  var MysteryObject = require( 'EQUALITY_EXPLORER/basics/model/MysteryObject' );

  // images
  var sphereImage = require( 'image!EQUALITY_EXPLORER/sphere.png' );
  var sphereShadowImage = require( 'image!EQUALITY_EXPLORER/sphereShadow.png' );
  var squareImage = require( 'image!EQUALITY_EXPLORER/square.png' );
  var squareShadowImage = require( 'image!EQUALITY_EXPLORER/squareShadow.png' );

  /**
   * @constructor
   */
  function ShapesScene() {

    // mystery objects for this scene
    var mysteryObjects = [

      // name, weight, image, shadow
      new MysteryObject( 'sphere', 2, sphereImage, sphereShadowImage ),
      new MysteryObject( 'square', 3, squareImage, squareShadowImage )
    ];

    BasicsScene.call( this, 'shapes', mysteryObjects, {
      icon: ConstantTermNode.createIcon( ReducedFraction.withInteger( 1 ) ),
      hasConstantTerms: true // this scene allows you to create constant terms
    } );
  }

  equalityExplorer.register( 'ShapesScene', ShapesScene );

  return inherit( BasicsScene, ShapesScene );
} );
