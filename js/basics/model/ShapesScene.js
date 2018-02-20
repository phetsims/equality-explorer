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
  var ConstantTermCreator = require( 'EQUALITY_EXPLORER/common/model/ConstantTermCreator' );
  var ConstantTermNode = require( 'EQUALITY_EXPLORER/common/view/ConstantTermNode' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MysteryTermCreator = require( 'EQUALITY_EXPLORER/common/model/MysteryTermCreator' );
  var NumberProperty = require( 'AXON/NumberProperty' );
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

    // weight of each type of shape
    var sphereProperty = new NumberProperty( 2, { valueType: 'Integer' } );
    var squareProperty = new NumberProperty( 3, { valueType: 'Integer' } );

    // icon that represents this scene
    var icon = ConstantTermNode.createIcon( 1 );
    
    BasicsScene.call( this, 'shapes', icon,
      createTermCreators( sphereProperty, squareProperty, EqualityExplorerQueryParameters.leftBasics ),
      createTermCreators( sphereProperty, squareProperty, EqualityExplorerQueryParameters.rightBasics )
    );
  }

  equalityExplorer.register( 'ShapesScene', ShapesScene );

  /**
   * Creates the term creators for this scene.
   * @param {NumberProperty} sphereProperty
   * @param {NumberProperty} squareProperty
   * @param {number[]} initialNumberOfTermsOnScale
   * @returns {TermCreator[]}
   */
  function createTermCreators( sphereProperty, squareProperty, initialNumberOfTermsOnScale ) {

    assert && assert( initialNumberOfTermsOnScale.length === 3 );
    var index = 0;

    return [
      new MysteryTermCreator( 'sphere', sphereProperty, sphereImage, sphereShadowImage, {
        initialNumberOfTermsOnScale: initialNumberOfTermsOnScale[ index++ ]
      } ),
      new MysteryTermCreator( 'square', squareProperty, squareImage, squareShadowImage, {
        initialNumberOfTermsOnScale: initialNumberOfTermsOnScale[ index++ ]
      } ),
      new ConstantTermCreator( {
        defaultValue: ReducedFraction.withInteger( 1 ),
        initialNumberOfTermsOnScale: initialNumberOfTermsOnScale[ index++ ]
      } )
    ];
  }

  return inherit( BasicsScene, ShapesScene );
} );
