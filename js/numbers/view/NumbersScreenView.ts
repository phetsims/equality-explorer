// Copyright 2017-2022, University of Colorado Boulder

/**
 * View for the 'Numbers' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EqualityExplorerScreenView from '../../common/view/EqualityExplorerScreenView.js';
import equalityExplorer from '../../equalityExplorer.js';
import NumbersSceneNode, { NumbersSceneNodeOptions } from './NumbersSceneNode.js';
import NumbersModel from '../model/NumbersModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import EqualityExplorerScene from '../../common/model/EqualityExplorerScene.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import EqualityExplorerSceneNode from '../../common/view/EqualityExplorerSceneNode.js';

export default class NumbersScreenView extends EqualityExplorerScreenView {

  public constructor( model: NumbersModel, tandem: Tandem ) {
    super( model, tandem );
  }

  protected override createSceneNode( scene: EqualityExplorerScene,
                                      sceneProperty: Property<EqualityExplorerScene>,
                                      equationAccordionBoxExpandedProperty: Property<boolean>,
                                      snapshotsAccordionBoxExpandedProperty: Property<boolean>,
                                      layoutBounds: Bounds2,
                                      providedOptions?: NumbersSceneNodeOptions ): EqualityExplorerSceneNode {
    return new NumbersSceneNode( scene, sceneProperty, equationAccordionBoxExpandedProperty,
      snapshotsAccordionBoxExpandedProperty, layoutBounds, providedOptions );
  }
}

equalityExplorer.register( 'NumbersScreenView', NumbersScreenView );