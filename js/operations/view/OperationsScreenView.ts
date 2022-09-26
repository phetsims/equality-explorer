// Copyright 2017-2022, University of Colorado Boulder

/**
 * View for the 'Operations' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import EqualityExplorerScreenView from '../../common/view/EqualityExplorerScreenView.js';
import equalityExplorer from '../../equalityExplorer.js';
import OperationsModel from '../model/OperationsModel.js';
import OperationsSceneNode, { OperationsSceneNodeOptions } from './OperationsSceneNode.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import OperationsScene from '../model/OperationsScene.js';

export default class OperationsScreenView extends EqualityExplorerScreenView {

  public constructor( model: OperationsModel, tandem: Tandem ) {
    super( model, tandem );
  }

  /**
   * Creates the Node for this scene.
   */
  protected override createSceneNode( scene: OperationsScene,
                                      equationAccordionBoxExpandedProperty: Property<boolean>,
                                      snapshotsAccordionBoxExpandedProperty: Property<boolean>,
                                      layoutBounds: Bounds2,
                                      options: OperationsSceneNodeOptions ): OperationsSceneNode {
    return new OperationsSceneNode( scene, equationAccordionBoxExpandedProperty,
      snapshotsAccordionBoxExpandedProperty, layoutBounds, options );
  }
}

equalityExplorer.register( 'OperationsScreenView', OperationsScreenView );