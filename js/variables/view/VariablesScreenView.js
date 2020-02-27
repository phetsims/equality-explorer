// Copyright 2017-2019, University of Colorado Boulder

/**
 * View for the 'Variables' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import EqualityExplorerScreenView from '../../common/view/EqualityExplorerScreenView.js';
import equalityExplorer from '../../equalityExplorer.js';
import VariablesSceneNode from './VariablesSceneNode.js';

/**
 * @param {VariablesModel} model
 * @constructor
 */
function VariablesScreenView( model ) {
  EqualityExplorerScreenView.call( this, model );
}

equalityExplorer.register( 'VariablesScreenView', VariablesScreenView );

export default inherit( EqualityExplorerScreenView, VariablesScreenView, {

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
  createSceneNode: function( scene, sceneProperty, equationAccordionBoxExpandedProperty,
                             snapshotsAccordionBoxExpandedProperty, layoutBounds, options ) {
    return new VariablesSceneNode( scene, sceneProperty, equationAccordionBoxExpandedProperty,
      snapshotsAccordionBoxExpandedProperty, layoutBounds, options );
  }
} );