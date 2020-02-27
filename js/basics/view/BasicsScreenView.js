// Copyright 2017-2019, University of Colorado Boulder

/**
 * View for the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import EqualityExplorerScreenView from '../../common/view/EqualityExplorerScreenView.js';
import equalityExplorer from '../../equalityExplorer.js';
import BasicsSceneNode from './BasicsSceneNode.js';

/**
 * @param {BasicsModel} model
 * @constructor
 */
function BasicsScreenView( model ) {
  EqualityExplorerScreenView.call( this, model, {
    hasNegativeTermsInToolbox: false // only positive terms in the toolbox
  } );
}

equalityExplorer.register( 'BasicsScreenView', BasicsScreenView );

export default inherit( EqualityExplorerScreenView, BasicsScreenView, {

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
    return new BasicsSceneNode( scene, sceneProperty, equationAccordionBoxExpandedProperty,
      snapshotsAccordionBoxExpandedProperty, layoutBounds, options );
  }
} );