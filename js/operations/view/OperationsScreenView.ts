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
import EqualityExplorerScene from '../../common/model/EqualityExplorerScene.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import OperationsScene from '../model/OperationsScene.js';
import EqualityExplorerSceneNode from '../../common/view/EqualityExplorerSceneNode.js';

export default class OperationsScreenView extends EqualityExplorerScreenView {

  public constructor( model: OperationsModel, tandem: Tandem ) {
    super( model, tandem );
  }

  /**
   * Creates the Node for this scene.
   */
  public override createSceneNode( scene: OperationsScene,
                                   sceneProperty: Property<EqualityExplorerScene>,
                                   equationAccordionBoxExpandedProperty: Property<boolean>,
                                   snapshotsAccordionBoxExpandedProperty: Property<boolean>,
                                   layoutBounds: Bounds2,
                                   options: OperationsSceneNodeOptions ): EqualityExplorerSceneNode {
    return new OperationsSceneNode( scene, sceneProperty, equationAccordionBoxExpandedProperty,
      snapshotsAccordionBoxExpandedProperty, layoutBounds, options );
  }
}

equalityExplorer.register( 'OperationsScreenView', OperationsScreenView );