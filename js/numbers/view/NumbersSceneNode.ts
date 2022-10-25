// Copyright 2018-2022, University of Colorado Boulder

/**
 * View of a scene in the 'Numbers' screen.  Identical to the 'Basics' screen.
 * Adds no new functionality. Provided for symmetry, so that every screen has a *SceneNode type.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import BasicsSceneNode, { BasicsSceneNodeOptions } from '../../basics/view/BasicsSceneNode.js';
import EqualityExplorerScene from '../../common/model/EqualityExplorerScene.js';
import equalityExplorer from '../../equalityExplorer.js';

type SelfOptions = EmptySelfOptions;

export type NumbersSceneNodeOptions = SelfOptions & BasicsSceneNodeOptions;

export default class NumbersSceneNode extends BasicsSceneNode {

  public constructor( scene: EqualityExplorerScene,
                      equationAccordionBoxExpandedProperty: Property<boolean>,
                      snapshotsAccordionBoxExpandedProperty: Property<boolean>,
                      layoutBounds: Bounds2,
                      providedOptions: NumbersSceneNodeOptions ) {
    super( scene, equationAccordionBoxExpandedProperty, snapshotsAccordionBoxExpandedProperty, layoutBounds, providedOptions );
  }
}

equalityExplorer.register( 'NumbersSceneNode', NumbersSceneNode );