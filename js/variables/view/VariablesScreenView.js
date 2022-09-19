// Copyright 2017-2020, University of Colorado Boulder

/**
 * View for the 'Variables' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EqualityExplorerScreenView from '../../common/view/EqualityExplorerScreenView.js';
import equalityExplorer from '../../equalityExplorer.js';
import VariablesSceneNode from './VariablesSceneNode.js';

export default class VariablesScreenView extends EqualityExplorerScreenView {

  /**
   * @param {VariablesModel} model
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
    return new VariablesSceneNode( scene, sceneProperty, equationAccordionBoxExpandedProperty,
      snapshotsAccordionBoxExpandedProperty, layoutBounds, options );
  }
}

equalityExplorer.register( 'VariablesScreenView', VariablesScreenView );