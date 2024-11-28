// Copyright 2017-2024, University of Colorado Boulder

/**
 * View for the 'Operations' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import EqualityExplorerScreenView from '../../common/view/EqualityExplorerScreenView.js';
import equalityExplorer from '../../equalityExplorer.js';
import OperationsModel from '../model/OperationsModel.js';
import OperationsScene from '../model/OperationsScene.js';
import OperationsSceneNode, { OperationsSceneNodeOptions } from './OperationsSceneNode.js';

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
                                      providedOptions: OperationsSceneNodeOptions ): OperationsSceneNode {
    return new OperationsSceneNode( scene, equationAccordionBoxExpandedProperty,
      snapshotsAccordionBoxExpandedProperty, layoutBounds, providedOptions );
  }
}

equalityExplorer.register( 'OperationsScreenView', OperationsScreenView );