// Copyright 2017-2022, University of Colorado Boulder

// ts-nocheck
/**
 * View for the 'Operations' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EqualityExplorerScreenView from '../../common/view/EqualityExplorerScreenView.js';
import equalityExplorer from '../../equalityExplorer.js';
import OperationsSceneNode from './OperationsSceneNode.js';

export default class OperationsScreenView extends EqualityExplorerScreenView {

  /**
   * @param {OperationsModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {
    super( model, tandem );
  }

  /**
   * Creates the Node for this scene.
   * @param {EqualityExplorerScene} scene
   * @param {Property.<EqualityExplorerScene>} sceneProperty - the selected scene
   * @param {BooleanProperty} equationAccordionBoxExpandedProperty
   * @param {BooleanProperty} snapshotsAccordionBoxExpandedProperty
   * @param {Bounds2} layoutBounds
   * @param {Object} [options]
   * @returns {Node}
   * @protected
   * @override
   */
  createSceneNode( scene, sceneProperty, equationAccordionBoxExpandedProperty,
                   snapshotsAccordionBoxExpandedProperty, layoutBounds, options ) {
    return new OperationsSceneNode( scene, sceneProperty, equationAccordionBoxExpandedProperty,
      snapshotsAccordionBoxExpandedProperty, layoutBounds, options );
  }
}

equalityExplorer.register( 'OperationsScreenView', OperationsScreenView );