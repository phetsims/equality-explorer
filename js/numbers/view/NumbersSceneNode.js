// Copyright 2018, University of Colorado Boulder

/**
 * View of a scene in the 'Numbers' screen.  Identical to the 'Basics' screen.
 * Adds no new functionality. Provided for symmetry, so that every screen has a *SceneNode type.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BasicsSceneNode = require( 'EQUALITY_EXPLORER/basics/view/BasicsSceneNode' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {EqualityExplorerScene} scene
   * @param {Property.<EqualityExplorerScene>} sceneProperty - the selected scene
   * @param {Bounds2} layoutBounds
   * @param {Object} [options]
   * @constructor
   */
  function NumbersSceneNode( scene, sceneProperty, layoutBounds, options ) {
    BasicsSceneNode.call( this, scene, sceneProperty, layoutBounds, options );
  }

  equalityExplorer.register( 'NumbersSceneNode', NumbersSceneNode );

  return inherit( BasicsSceneNode, NumbersSceneNode );
} );
 