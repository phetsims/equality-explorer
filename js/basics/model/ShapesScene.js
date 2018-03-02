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

  // images
  var sphereImage = require( 'image!EQUALITY_EXPLORER/sphere.png' );
  var sphereShadowImage = require( 'image!EQUALITY_EXPLORER/sphereShadow.png' );
  var squareImage = require( 'image!EQUALITY_EXPLORER/square.png' );
  var squareShadowImage = require( 'image!EQUALITY_EXPLORER/squareShadow.png' );

  /**
   * @constructor
   */
  function ShapesScene() {

    // icon that represents this scene
    var icon = ConstantTermNode.createIcon( ReducedFraction.withInteger( 1 ) );

    // mystery objects for this scene
    var shapes = [
      { name: 'sphere', weight: 2, icon: sphereImage, shadow: sphereShadowImage },
      { name: 'square', weight: 3, icon: squareImage, shadow: squareShadowImage }
    ];

    BasicsScene.call( this, 'shapes', icon, shapes, {
      hasConstantTerms: true // this scene allows you to create constant terms
    } );
  }

  equalityExplorer.register( 'ShapesScene', ShapesScene );

  return inherit( BasicsScene, ShapesScene );
} );
