// Copyright 2017, University of Colorado Boulder

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
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MysteryTermCreator = require( 'EQUALITY_EXPLORER/common/model/MysteryTermCreator' );
  var TermIcons = require( 'EQUALITY_EXPLORER/common/view/TermIcons' );

  /**
   * @constructor
   */
  function FruitsScene() {
    BasicsScene.call( this, 'fruits', TermIcons.APPLE_NODE,
      createTermCreators( EqualityExplorerQueryParameters.leftBasics ),
      createTermCreators( EqualityExplorerQueryParameters.rightBasics )
    );
  }

  equalityExplorer.register( 'FruitsScene', FruitsScene );

  /**
   * Creates the term creators for this scene.
   * @param {number[]} initialNumberOfTermsOnScale
   * @returns {AbstractTermCreator[]}
   */
  function createTermCreators( initialNumberOfTermsOnScale ) {
    assert && assert( initialNumberOfTermsOnScale.length === 3 );
    var index = 0;
    return [
      new MysteryTermCreator( TermIcons.APPLE_NODE, TermIcons.APPLE_SHADOW_NODE, {
        weight: 4,
        initialNumberOfTermsOnScale: initialNumberOfTermsOnScale[ index++ ]
      } ),
      new MysteryTermCreator( TermIcons.LEMON_NODE, TermIcons.LEMON_SHADOW_NODE, {
        weight: 5,
        initialNumberOfTermsOnScale: initialNumberOfTermsOnScale[ index++ ]
      } ),
      new MysteryTermCreator( TermIcons.ORANGE_NODE, TermIcons.ORANGE_SHADOW_NODE, {
        weight: 2,
        initialNumberOfTermsOnScale: initialNumberOfTermsOnScale[ index++ ]
      } )
    ];
  }

  return inherit( BasicsScene, FruitsScene );
} );
