// Copyright 2017-2022, University of Colorado Boulder

/**
 * View for the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EqualityExplorerScreenView from '../../common/view/EqualityExplorerScreenView.js';
import equalityExplorer from '../../equalityExplorer.js';
import BasicsSceneNode, { BasicsSceneNodeOptions } from './BasicsSceneNode.js';
import EqualityExplorerScene from '../../common/model/EqualityExplorerScene.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Property from '../../../../axon/js/Property.js';
import BasicsModel from '../model/BasicsModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import EqualityExplorerSceneNode from '../../common/view/EqualityExplorerSceneNode.js';

export default class BasicsScreenView extends EqualityExplorerScreenView {

  public constructor( model: BasicsModel, tandem: Tandem ) {
    super( model, tandem, {
      hasNegativeTermsInToolbox: false // only positive terms in the toolbox
    } );
  }

  /**
   * Creates the Node for this scene.
   */
  protected override createSceneNode( scene: EqualityExplorerScene,
                                      equationAccordionBoxExpandedProperty: Property<boolean>,
                                      snapshotsAccordionBoxExpandedProperty: Property<boolean>,
                                      layoutBounds: Bounds2,
                                      providedOptions?: BasicsSceneNodeOptions ): EqualityExplorerSceneNode {
    return new BasicsSceneNode( scene, equationAccordionBoxExpandedProperty,
      snapshotsAccordionBoxExpandedProperty, layoutBounds, providedOptions );
  }
}

equalityExplorer.register( 'BasicsScreenView', BasicsScreenView );