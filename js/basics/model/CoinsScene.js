// Copyright 2017, University of Colorado Boulder

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
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MysteryTermCreator = require( 'EQUALITY_EXPLORER/common/model/MysteryTermCreator' );
  var TermIcons = require( 'EQUALITY_EXPLORER/common/view/TermIcons' );

  /**
   * @constructor
   */
  function CoinsScene() {
    BasicsScene.call( this, 'coins', TermIcons.COIN3_NODE,
      createTermCreators( EqualityExplorerQueryParameters.leftBasics ),
      createTermCreators( EqualityExplorerQueryParameters.rightBasics )
    );
  }

  equalityExplorer.register( 'CoinsScene', CoinsScene );

  /**
   * Creates the term creators for this scene.
   * @param {number[]} initialNumberOfTermsOnScale
   * @returns {AbstractTermCreator[]}
   */
  function createTermCreators( initialNumberOfTermsOnScale ) {
    assert && assert( initialNumberOfTermsOnScale.length === 3 );
    var index = 0;
    return [
      new MysteryTermCreator( TermIcons.COIN1_NODE, TermIcons.COIN1_SHADOW_NODE, {
        weight: 3,
        initialNumberOfTermsOnScale: initialNumberOfTermsOnScale[ index++ ]
      } ),
      new MysteryTermCreator( TermIcons.COIN2_NODE, TermIcons.COIN2_SHADOW_NODE, {
        weight: 2,
        initialNumberOfTermsOnScale: initialNumberOfTermsOnScale[ index++ ]
      } ),
      new MysteryTermCreator( TermIcons.COIN3_NODE, TermIcons.COIN3_SHADOW_NODE, {
        weight: 5,
        initialNumberOfTermsOnScale: initialNumberOfTermsOnScale[ index++ ]
      } )
    ];
  }

  return inherit( BasicsScene, CoinsScene );
} );
