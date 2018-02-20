// Copyright 2017-2018, University of Colorado Boulder

/**
 * The 'Coins' scene in the 'Basics' screen.
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
  var coin1Image = require( 'image!EQUALITY_EXPLORER/coin1.png' );
  var coin1ShadowImage = require( 'image!EQUALITY_EXPLORER/coin1Shadow.png' );
  var coin2Image = require( 'image!EQUALITY_EXPLORER/coin2.png' );
  var coin2ShadowImage = require( 'image!EQUALITY_EXPLORER/coin2Shadow.png' );
  var coin3Image = require( 'image!EQUALITY_EXPLORER/coin3.png' );
  var coin3ShadowImage = require( 'image!EQUALITY_EXPLORER/coin3Shadow.png' );

  /**
   * @constructor
   */
  function CoinsScene() {

    // weight of each type of coin
    var coin1Property = new NumberProperty( 3, { valueType: 'Integer' } );
    var coin2Property = new NumberProperty( 2, { valueType: 'Integer' } );
    var coin3Property = new NumberProperty( 5, { valueType: 'Integer' } );

    // icon that represents this scene
    var icon = new Image( coin3Image, {
      maxHeight: EqualityExplorerConstants.SMALL_TERM_DIAMETER
    } );

    BasicsScene.call( this, 'coins', icon,
      createTermCreators( coin1Property, coin2Property, coin3Property, EqualityExplorerQueryParameters.leftBasics ),
      createTermCreators( coin1Property, coin2Property, coin3Property, EqualityExplorerQueryParameters.rightBasics )
    );
  }

  equalityExplorer.register( 'CoinsScene', CoinsScene );

  /**
   * Creates the term creators for this scene.
   * @param {NumberProperty} coin1Property
   * @param {NumberProperty} coin2Property
   * @param {NumberProperty} coin3Property
   * @param {number[]} initialNumberOfTermsOnScale
   * @returns {TermCreator[]}
   */
  function createTermCreators( coin1Property, coin2Property, coin3Property, initialNumberOfTermsOnScale ) {

    assert && assert( initialNumberOfTermsOnScale.length === 3 );
    var index = 0;

    return [
      new MysteryTermCreator( 'coin1', coin1Property, coin1Image, coin1ShadowImage, {
        initialNumberOfTermsOnScale: initialNumberOfTermsOnScale[ index++ ]
      } ),
      new MysteryTermCreator( 'coin2', coin2Property, coin2Image, coin2ShadowImage, {
        initialNumberOfTermsOnScale: initialNumberOfTermsOnScale[ index++ ]
      } ),
      new MysteryTermCreator( 'coin3', coin3Property, coin3Image, coin3ShadowImage, {
        initialNumberOfTermsOnScale: initialNumberOfTermsOnScale[ index++ ]
      } )
    ];
  }

  return inherit( BasicsScene, CoinsScene );
} );
