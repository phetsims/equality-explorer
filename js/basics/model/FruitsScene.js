// Copyright 2017-2018, University of Colorado Boulder

/**
 * The 'Fruit' scene in the 'Basics' screen.
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
  var appleImage = require( 'image!EQUALITY_EXPLORER/apple.png' );
  var appleShadowImage = require( 'image!EQUALITY_EXPLORER/appleShadow.png' );
  var lemonImage = require( 'image!EQUALITY_EXPLORER/lemon.png' );
  var lemonShadowImage = require( 'image!EQUALITY_EXPLORER/lemonShadow.png' );
  var orangeImage = require( 'image!EQUALITY_EXPLORER/orange.png' );
  var orangeShadowImage = require( 'image!EQUALITY_EXPLORER/orangeShadow.png' );

  /**
   * @constructor
   */
  function FruitsScene() {

    // weight of each type of fruit
    var appleProperty = new NumberProperty( 4, { valueType: 'Integer' } );
    var lemonProperty = new NumberProperty( 5, { valueType: 'Integer' } );
    var orangeProperty = new NumberProperty( 2, { valueType: 'Integer' } );

    // icon that represents this scene
    var icon = new Image( appleImage, {
      maxHeight: EqualityExplorerConstants.SMALL_TERM_DIAMETER
    } );

    BasicsScene.call( this, 'fruits', icon,
      createTermCreators( appleProperty, lemonProperty, orangeProperty, EqualityExplorerQueryParameters.leftBasics ),
      createTermCreators( appleProperty, lemonProperty, orangeProperty, EqualityExplorerQueryParameters.rightBasics )
    );
  }

  equalityExplorer.register( 'FruitsScene', FruitsScene );

  /**
   * Creates the term creators for this scene.
   * @param {NumberProperty} appleProperty
   * @param {NumberProperty} lemonProperty
   * @param {NumberProperty} orangeProperty
   * @param {number[]} initialNumberOfTermsOnScale
   * @returns {TermCreator[]}
   */
  function createTermCreators( appleProperty, lemonProperty, orangeProperty, initialNumberOfTermsOnScale) {

    assert && assert( initialNumberOfTermsOnScale.length === 3 );
    var index = 0;

    return [
      new MysteryTermCreator( 'apple', appleProperty, appleImage, appleShadowImage, {
        initialNumberOfTermsOnScale: initialNumberOfTermsOnScale[ index++ ]
      } ),
      new MysteryTermCreator( 'lemon', lemonProperty, lemonImage, lemonShadowImage, {
        initialNumberOfTermsOnScale: initialNumberOfTermsOnScale[ index++ ]
      } ),
      new MysteryTermCreator( 'orange', orangeProperty, orangeImage, orangeShadowImage, {
        initialNumberOfTermsOnScale: initialNumberOfTermsOnScale[ index++ ]
      } )
    ];
  }

  return inherit( BasicsScene, FruitsScene );
} );
