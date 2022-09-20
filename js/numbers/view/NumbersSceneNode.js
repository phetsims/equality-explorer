// Copyright 2018-2022, University of Colorado Boulder

/**
 * View of a scene in the 'Numbers' screen.  Identical to the 'Basics' screen.
 * Adds no new functionality. Provided for symmetry, so that every screen has a *SceneNode type.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BasicsSceneNode from '../../basics/view/BasicsSceneNode.js';
import equalityExplorer from '../../equalityExplorer.js';

export default class NumbersSceneNode extends BasicsSceneNode {

  /**
   * @param {EqualityExplorerScene} scene
   * @param {Property.<EqualityExplorerScene>} sceneProperty - the selected scene
   * @param {BooleanProperty} equationAccordionBoxExpandedProperty
   * @param {BooleanProperty} snapshotsAccordionBoxExpandedProperty
   * @param {Bounds2} layoutBounds
   * @param {Object} [options]
   */
  constructor( scene, sceneProperty, equationAccordionBoxExpandedProperty,
               snapshotsAccordionBoxExpandedProperty, layoutBounds, options ) {
    super( scene, sceneProperty, equationAccordionBoxExpandedProperty,
      snapshotsAccordionBoxExpandedProperty, layoutBounds, options );
  }
}

equalityExplorer.register( 'NumbersSceneNode', NumbersSceneNode );