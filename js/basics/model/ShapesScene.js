// Copyright 2017, University of Colorado Boulder

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
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MysteryTermCreator = require( 'EQUALITY_EXPLORER/common/model/MysteryTermCreator' );
  var TermIcons = require( 'EQUALITY_EXPLORER/common/view/TermIcons' );

  /**
   * @constructor
   */
  function ShapesScene() {
    BasicsScene.call( this, 'shapes', TermIcons.POSITIVE_ONE_NODE,
      createTermCreators( EqualityExplorerQueryParameters.leftBasics ),
      createTermCreators( EqualityExplorerQueryParameters.rightBasics )
    );
  }

  equalityExplorer.register( 'ShapesScene', ShapesScene );

  /**
   * Creates the term creators for this scene.
   * @param {number[]} initialNumberOfTermsOnScale
   * @returns {TermCreator[]}
   */
  function createTermCreators( initialNumberOfTermsOnScale ) {
    assert && assert( initialNumberOfTermsOnScale.length === 3 );
    var index = 0;
    return [
      new MysteryTermCreator( TermIcons.SPHERE_NODE, TermIcons.SPHERE_SHADOW_NODE, {
        weight: 2,
        initialNumberOfTermsOnScale: initialNumberOfTermsOnScale[ index++ ]
      } ),
      new MysteryTermCreator( TermIcons.SQUARE_NODE, TermIcons.SQUARE_SHADOW_NODE, {
        weight: 3,
        initialNumberOfTermsOnScale: initialNumberOfTermsOnScale[ index++ ]
      } ),
      new ConstantTermCreator( TermIcons.POSITIVE_ONE_NODE, TermIcons.ONE_SHADOW_NODE, {
        weight: 1,
        initialNumberOfTermsOnScale: initialNumberOfTermsOnScale[ index++ ]
      } )
    ];
  }

  return inherit( BasicsScene, ShapesScene );
} );
