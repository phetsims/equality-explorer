// Copyright 2017-2022, University of Colorado Boulder

/**
 * View of a scene in the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import { Node, Rectangle } from '../../../../scenery/js/imports.js';
import EqualityExplorerConstants from '../../common/EqualityExplorerConstants.js';
import EqualityExplorerQueryParameters from '../../common/EqualityExplorerQueryParameters.js';
import BalanceScaleNode from '../../common/view/BalanceScaleNode.js';
import EqualityExplorerLockNode from '../../common/view/EqualityExplorerLockNode.js';
import EqualityExplorerSceneNode, { EqualityExplorerSceneNodeOptions } from '../../common/view/EqualityExplorerSceneNode.js';
import EquationAccordionBox from '../../common/view/EquationAccordionBox.js';
import SnapshotsAccordionBox from '../../common/view/SnapshotsAccordionBox.js';
import TermsToolboxNode from '../../common/view/TermsToolboxNode.js';
import equalityExplorer from '../../equalityExplorer.js';
import BasicsScene from '../model/BasicsScene.js';
import { SnapshotControlOptions } from '../../common/view/SnapshotControl.js';
import OopsDialog from '../../../../scenery-phet/js/OopsDialog.js';

type SelfOptions = {
  termsToolboxContentSize?: Dimension2;
  termsToolboxSpacing?: number; // spacing of terms in the toolboxes that appear below the scale
  organizeButtonVisible?: boolean; // is the organize button visible on the scale?

  // whether variable values are visible in snapshots, null if the feature is not supported
  variableValuesVisibleProperty?: Property<boolean> | null;

  // SnapshotControlOptions
  snapshotControlOptions?: StrictOmit<SnapshotControlOptions, 'tandem'>;
};

export type BasicsSceneNodeOptions = SelfOptions & EqualityExplorerSceneNodeOptions;

export default class BasicsSceneNode extends EqualityExplorerSceneNode {

  // For layout
  public readonly equationAccordionBox: Node;

  public constructor( scene: BasicsScene,
                      equationAccordionBoxExpandedProperty: Property<boolean>,
                      snapshotsAccordionBoxExpandedProperty: Property<boolean>,
                      layoutBounds: Bounds2,
                      numberTooBigDialog: OopsDialog,
                      providedOptions: BasicsSceneNodeOptions ) {

    const options = optionize<BasicsSceneNodeOptions, StrictOmit<SelfOptions, 'snapshotControlOptions'>, EqualityExplorerSceneNodeOptions>()( {

      // SelfOptions
      termsToolboxContentSize: new Dimension2( 250, 50 ),
      termsToolboxSpacing: 50,
      organizeButtonVisible: true,
      variableValuesVisibleProperty: null
    }, providedOptions );

    // locals vars to improve readability
    const scale = scene.scale;
    const leftTermCreators = scene.leftTermCreators;
    const rightTermCreators = scene.rightTermCreators;

    // terms live in this layer
    const termsLayer = new Node();

    const balanceScaleNode = new BalanceScaleNode( scale, {
      organizeButtonVisible: options.organizeButtonVisible,
      disposeTermsNotOnScale: scene.disposeTermsNotOnScale.bind( scene ),
      tandem: options.tandem.createTandem( 'balanceScaleNode' )
    } );

    const termToolboxNodesTandem = options.tandem.createTandem( 'termToolboxNodes' );

    const leftTermsToolboxNode = new TermsToolboxNode( leftTermCreators, scale.leftPlate, termsLayer, {
      hasNegativeTermsInToolbox: scene.hasNegativeTermsInToolbox,
      contentSize: options.termsToolboxContentSize,
      spacing: options.termsToolboxSpacing,
      centerX: scale.leftPlate.positionProperty.value.x,
      bottom: layoutBounds.bottom - EqualityExplorerConstants.SCREEN_VIEW_Y_MARGIN,
      //TODO confirm that leftTermsToolboxNode should be instrumented
      tandem: termToolboxNodesTandem.createTandem( 'leftTermsToolboxNode' )
    } );

    const rightTermsToolboxNode = new TermsToolboxNode( rightTermCreators, scale.rightPlate, termsLayer, {
      hasNegativeTermsInToolbox: scene.hasNegativeTermsInToolbox,
      contentSize: options.termsToolboxContentSize,
      spacing: options.termsToolboxSpacing,
      centerX: scale.rightPlate.positionProperty.value.x,
      bottom: leftTermsToolboxNode.bottom,
      //TODO confirm that rightTermsToolboxNode should be instrumented
      tandem: termToolboxNodesTandem.createTandem( 'rightTermsToolboxNode' )
    } );

    const equationAccordionBox = new EquationAccordionBox( leftTermCreators, rightTermCreators, {
      fixedWidth: Math.floor( rightTermsToolboxNode.right - leftTermsToolboxNode.left ),
      expandedProperty: equationAccordionBoxExpandedProperty,

      // Slightly off center, so that the equation's relational operator is horizontally centered
      // above the scale's arrow. The offset was determined empirically.
      centerX: scale.position.x - 15,
      top: layoutBounds.top + EqualityExplorerConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'equationAccordionBox' )
    } );

    const snapshotsAccordionBox = new SnapshotsAccordionBox( scene, {
      snapshotControlOptions: options.snapshotControlOptions,
      variableValuesVisibleProperty: options.variableValuesVisibleProperty,
      fixedWidth: Math.floor( ( layoutBounds.right - balanceScaleNode.right ) -
                              EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN - 15 ),
      expandedProperty: snapshotsAccordionBoxExpandedProperty,
      right: layoutBounds.right - EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN,
      top: layoutBounds.top + EqualityExplorerConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'snapshotsAccordionBox' )
    } );

    const children = [
      balanceScaleNode,
      leftTermsToolboxNode,
      rightTermsToolboxNode,
      equationAccordionBox,
      snapshotsAccordionBox,
      termsLayer // on top, so that terms are in front of everything else
    ];

    // Some scenes support locking the left and right sides of the equation,
    // such that an action on one side results in an equivalent action on the opposite side.
    if ( scene.lockedProperty && EqualityExplorerQueryParameters.lockVisible ) {
      const lockNode = new EqualityExplorerLockNode( scene.lockedProperty, {

        // offsets determined empirically, so that the body of the lock appears to be centered between the toolboxes
        centerX: leftTermsToolboxNode.right + ( rightTermsToolboxNode.left - leftTermsToolboxNode.right ) / 2 + 4,
        centerY: leftTermsToolboxNode.centerY - 5,
        tandem: options.tandem.createTandem( 'lockNode' )
      } );
      children.unshift( lockNode ); // add to beginning
    }

    // Render the drag bounds for the left and right plates
    if ( phet.chipper.queryParameters.dev ) {
      const dragBoundsOption = { stroke: 'red', lineWidth: 0.25 };
      children.push( new Rectangle( scene.leftDragBounds, dragBoundsOption ) );
      children.push( new Rectangle( scene.rightDragBounds, dragBoundsOption ) );
    }

    options.children = children;

    super( scene, snapshotsAccordionBox, termsLayer, numberTooBigDialog, options );

    this.equationAccordionBox = equationAccordionBox;
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

equalityExplorer.register( 'BasicsSceneNode', BasicsSceneNode );