// Copyright 2017, University of Colorado Boulder

/**
 * The sole scene in the 'Numbers' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ConstantTermCreator = require( 'EQUALITY_EXPLORER/common/model/ConstantTermCreator' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LockableScene = require( 'EQUALITY_EXPLORER/common/model/LockableScene' );
  var TermIcons = require( 'EQUALITY_EXPLORER/common/view/TermIcons' );

  /**
   * @constructor
   */
  function NumbersScene() {
    LockableScene.call( this, 'numbers',
      createTermCreators( EqualityExplorerQueryParameters.leftNumbers ),
      createTermCreators( EqualityExplorerQueryParameters.rightNumbers )
    );
  }

  equalityExplorer.register( 'NumbersScene', NumbersScene );

  /**
   * Creates the term creators for this scene.
   * @param {number} initialNumberOfTermsOnScale
   * @returns {AbstractTermCreator[]}
   */
  function createTermCreators( initialNumberOfTermsOnScale ) {
    assert && assert( initialNumberOfTermsOnScale.length === 2 );
    var index = 0;
    return [
      new ConstantTermCreator( TermIcons.POSITIVE_ONE_NODE, TermIcons.ONE_SHADOW_NODE, {
        weight: 1,
        initialNumberOfTermsOnScale: initialNumberOfTermsOnScale[ index++ ]
      } ),
      new ConstantTermCreator( TermIcons.NEGATIVE_ONE_NODE, TermIcons.ONE_SHADOW_NODE, {
        weight: -1,
        initialNumberOfTermsOnScale: initialNumberOfTermsOnScale[ index++ ]
      } )
    ];
  }

  return inherit( LockableScene, NumbersScene );
} );
