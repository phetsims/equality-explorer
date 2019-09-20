// Copyright 2018-2019, University of Colorado Boulder

/**
 * View of a scene in the 'Numbers' screen.  Identical to the 'Basics' screen.
 * Adds no new functionality. Provided for symmetry, so that every screen has a *SceneNode type.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BasicsSceneNode = require( 'EQUALITY_EXPLORER/basics/view/BasicsSceneNode' );
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {EqualityExplorerScene} scene
   * @param {Property.<EqualityExplorerScene>} sceneProperty - the selected scene
   * @param {BooleanProperty} equationAccordionBoxExpandedProperty
   * @param {BooleanProperty} snapshotsAccordionBoxExpandedProperty
   * @param {Bounds2} layoutBounds
   * @param {Object} [options]
   * @constructor
   */
  function NumbersSceneNode( scene, sceneProperty, equationAccordionBoxExpandedProperty,
                             snapshotsAccordionBoxExpandedProperty, layoutBounds, options ) {
    BasicsSceneNode.call( this, scene, sceneProperty, equationAccordionBoxExpandedProperty,
      snapshotsAccordionBoxExpandedProperty, layoutBounds, options );
  }

  equalityExplorer.register( 'NumbersSceneNode', NumbersSceneNode );

  return inherit( BasicsSceneNode, NumbersSceneNode );
} );
 