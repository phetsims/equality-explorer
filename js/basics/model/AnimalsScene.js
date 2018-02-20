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
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MysteryTermCreator = require( 'EQUALITY_EXPLORER/common/model/MysteryTermCreator' );
  var NumberProperty = require( 'AXON/NumberProperty' );

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

    // weight of each type of animal
    var dogProperty = new NumberProperty( 11, { valueType: 'Integer' } );
    var catProperty = new NumberProperty( 4, { valueType: 'Integer' } );
    var turtleProperty = new NumberProperty( 6, { valueType: 'Integer' } );

    // icon that represents this scene
    var icon = new Image( turtleImage, {
      maxHeight: EqualityExplorerConstants.SMALL_TERM_DIAMETER
    } );

    BasicsScene.call( this, 'animals', icon,
      createTermCreators( dogProperty, catProperty, turtleProperty, EqualityExplorerQueryParameters.leftBasics ),
      createTermCreators( dogProperty, catProperty, turtleProperty, EqualityExplorerQueryParameters.rightBasics ), {
        maxWeight: 50
      } );
  }

  equalityExplorer.register( 'AnimalsScene', AnimalsScene );

  /**
   * Creates the term creators for this scene.
   * @param {NumberProperty} dogProperty
   * @param {NumberProperty} catProperty
   * @param {NumberProperty} turtleProperty
   * @param {number[]} initialNumberOfTermsOnScale
   * @returns {TermCreator[]}
   */
  function createTermCreators( dogProperty, catProperty, turtleProperty, initialNumberOfTermsOnScale ) {

    assert && assert( initialNumberOfTermsOnScale.length === 3 );
    var index = 0;

    return [
      new MysteryTermCreator( 'dog', dogProperty, dogImage, dogShadowImage, {
        initialNumberOfTermsOnScale: initialNumberOfTermsOnScale[ index++ ]
      } ),
      new MysteryTermCreator( 'cat', catProperty, catImage, catShadowImage, {
        initialNumberOfTermsOnScale: initialNumberOfTermsOnScale[ index++ ]
      } ),
      new MysteryTermCreator( 'turtle', turtleProperty, turtleImage, turtleShadowImage, {
        initialNumberOfTermsOnScale: initialNumberOfTermsOnScale[ index++ ]
      } )
    ];
  }

  return inherit( BasicsScene, AnimalsScene );
} );
