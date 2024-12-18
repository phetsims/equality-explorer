// Copyright 2017-2024, University of Colorado Boulder

/**
 * View for the 'Numbers' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import EqualityExplorerScene from '../../common/model/EqualityExplorerScene.js';
import EqualityExplorerScreenView from '../../common/view/EqualityExplorerScreenView.js';
import equalityExplorer from '../../equalityExplorer.js';
import NumbersModel from '../model/NumbersModel.js';
import NumbersSceneNode, { NumbersSceneNodeOptions } from './NumbersSceneNode.js';

export default class NumbersScreenView extends EqualityExplorerScreenView {

  public constructor( model: NumbersModel, tandem: Tandem ) {
    super( model, tandem );
  }

  protected override createSceneNode( scene: EqualityExplorerScene,
                                      equationAccordionBoxExpandedProperty: Property<boolean>,
                                      snapshotsAccordionBoxExpandedProperty: Property<boolean>,
                                      layoutBounds: Bounds2,
                                      providedOptions: NumbersSceneNodeOptions ): NumbersSceneNode {
    return new NumbersSceneNode( scene, equationAccordionBoxExpandedProperty,
      snapshotsAccordionBoxExpandedProperty, layoutBounds, providedOptions );
  }
}

equalityExplorer.register( 'NumbersScreenView', NumbersScreenView );