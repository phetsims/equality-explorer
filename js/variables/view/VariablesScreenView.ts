// Copyright 2017-2022, University of Colorado Boulder

/**
 * View for the 'Variables' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import EqualityExplorerScene from '../../common/model/EqualityExplorerScene.js';
import EqualityExplorerScreenView from '../../common/view/EqualityExplorerScreenView.js';
import equalityExplorer from '../../equalityExplorer.js';
import VariablesModel from '../model/VariablesModel.js';
import VariablesSceneNode, { VariablesSceneNodeOptions } from './VariablesSceneNode.js';

export default class VariablesScreenView extends EqualityExplorerScreenView {

  public constructor( model: VariablesModel, tandem: Tandem ) {
    super( model, tandem );
  }

  /**
   * Creates the Node for this scene.
   */
  protected override createSceneNode( scene: EqualityExplorerScene,
                                      equationAccordionBoxExpandedProperty: Property<boolean>,
                                      snapshotsAccordionBoxExpandedProperty: Property<boolean>,
                                      layoutBounds: Bounds2,
                                      providedOptions: VariablesSceneNodeOptions ): VariablesSceneNode {
    return new VariablesSceneNode( scene, equationAccordionBoxExpandedProperty,
      snapshotsAccordionBoxExpandedProperty, layoutBounds, providedOptions );
  }
}

equalityExplorer.register( 'VariablesScreenView', VariablesScreenView );