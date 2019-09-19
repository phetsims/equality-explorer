// Copyright 2017-2018, University of Colorado Boulder

/**
 * The 'Shapes' scene in the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BasicsScene = require( 'EQUALITY_EXPLORER/basics/model/BasicsScene' );
  const ConstantTermNode = require( 'EQUALITY_EXPLORER/common/view/ConstantTermNode' );
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const Fraction = require( 'PHETCOMMON/model/Fraction' );
  const inherit = require( 'PHET_CORE/inherit' );
  const ObjectVariable = require( 'EQUALITY_EXPLORER/basics/model/ObjectVariable' );

  // images
  const sphereImage = require( 'image!EQUALITY_EXPLORER/sphere.png' );
  const sphereShadowImage = require( 'image!EQUALITY_EXPLORER/sphereShadow.png' );
  const squareImage = require( 'image!EQUALITY_EXPLORER/square.png' );
  const squareShadowImage = require( 'image!EQUALITY_EXPLORER/squareShadow.png' );

  /**
   * @constructor
   */
  function ShapesScene() {

    var variables = [

      // name, image, shadow
      new ObjectVariable( 'sphere', sphereImage, sphereShadowImage, { value: 2 } ),
      new ObjectVariable( 'square', squareImage, squareShadowImage, { value: 3 } )
    ];

    BasicsScene.call( this, variables, {

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
