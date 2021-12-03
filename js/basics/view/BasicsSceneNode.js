// Copyright 2017-2021, University of Colorado Boulder

/**
 * View of a scene in the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import merge from '../../../../phet-core/js/merge.js';
import { Node, Rectangle } from '../../../../scenery/js/imports.js';
import EqualityExplorerConstants from '../../common/EqualityExplorerConstants.js';
import EqualityExplorerQueryParameters from '../../common/EqualityExplorerQueryParameters.js';
import BalanceScaleNode from '../../common/view/BalanceScaleNode.js';
import EqualityExplorerLockNode from '../../common/view/EqualityExplorerLockNode.js';
import EqualityExplorerSceneNode from '../../common/view/EqualityExplorerSceneNode.js';
import EquationAccordionBox from '../../common/view/EquationAccordionBox.js';
import SnapshotsAccordionBox from '../../common/view/SnapshotsAccordionBox.js';
import TermsToolbox from '../../common/view/TermsToolbox.js';
import equalityExplorer from '../../equalityExplorer.js';

class BasicsSceneNode extends EqualityExplorerSceneNode {

  /**
   * @param {EqualityExplorerScene} scene
   * @param {Property.<EqualityExplorerScene>} sceneProperty - the selected scene
   * @param {BooleanProperty} equationAccordionBoxExpandedProperty
   * @param {BooleanProperty} snapshotsAccordionBoxExpandedProperty
   * @param {Bounds2} layoutBounds
   * @param {Object} [options]
   */
  constructor( scene, sceneProperty, equationAccordionBoxExpandedProperty,
               snapshotsAccordionBoxExpandedProperty, layoutBounds, options ) {

    options = merge( {
      hasNegativeTermsInToolbox: true, // {boolean} if true, put negative terms in the toolbox, e.g. -x
      termsToolboxContentSize: new Dimension2( 250, 50 ),
      termsToolboxSpacing: 50, // spacing of terms in the toolboxes that appear below the scale
      organizeButtonVisible: true, // is the organize button visible on the scale?

      // {BooleanProperty|null} whether variable values are visible in snapshots, null if the feature is not supported
      variableValuesVisibleProperty: null,

      // SnapshotControl options
      snapshotControlOptions: null
    }, options );

    // locals vars to improve readability
    const scale = scene.scale;
    const leftTermCreators = scene.leftTermCreators;
    const rightTermCreators = scene.rightTermCreators;

    // terms live in this layer
    const termsLayer = new Node();

    const scaleNode = new BalanceScaleNode( scale, {
      organizeButtonVisible: options.organizeButtonVisible,
      disposeTermsNotOnScale: scene.disposeTermsNotOnScale.bind( scene )
    } );

    const leftTermsToolbox = new TermsToolbox( leftTermCreators, scale.leftPlate, termsLayer, {
      hasNegativeTermsInToolbox: options.hasNegativeTermsInToolbox,
      contentSize: options.termsToolboxContentSize,
      spacing: options.termsToolboxSpacing,
      centerX: scale.leftPlate.positionProperty.value.x,
      bottom: layoutBounds.bottom - EqualityExplorerConstants.SCREEN_VIEW_Y_MARGIN
    } );

    const rightTermsToolbox = new TermsToolbox( rightTermCreators, scale.rightPlate, termsLayer, {
      hasNegativeTermsInToolbox: options.hasNegativeTermsInToolbox,
      contentSize: options.termsToolboxContentSize,
      spacing: options.termsToolboxSpacing,
      centerX: scale.rightPlate.positionProperty.value.x,
      bottom: leftTermsToolbox.bottom
    } );

    const equationAccordionBox = new EquationAccordionBox( leftTermCreators, rightTermCreators, {
      fixedWidth: Math.floor( rightTermsToolbox.right - leftTermsToolbox.left ),
      expandedProperty: equationAccordionBoxExpandedProperty,

      // Slightly off center, so that the equation's relational operator is horizontally centered
      // above the scale's arrow. The offset was determined empirically.
      centerX: scale.position.x - 15,
      top: layoutBounds.top + EqualityExplorerConstants.SCREEN_VIEW_Y_MARGIN
    } );

    const snapshotsAccordionBox = new SnapshotsAccordionBox( scene, {
      snapshotControlOptions: options.snapshotControlOptions,
      variableValuesVisibleProperty: options.variableValuesVisibleProperty,
      fixedWidth: Math.floor( ( layoutBounds.right - scaleNode.right ) -
                              EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN - 15 ),
      expandedProperty: snapshotsAccordionBoxExpandedProperty,
      right: layoutBounds.right - EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN,
      top: layoutBounds.top + EqualityExplorerConstants.SCREEN_VIEW_Y_MARGIN
    } );

    const children = [
      scaleNode,
      leftTermsToolbox,
      rightTermsToolbox,
      equationAccordionBox,
      snapshotsAccordionBox,
      termsLayer // on top, so that terms are in front of everything else
    ];

    // Some scenes support locking the left and right sides of the equation,
    // such that an action on one side results in an equivalent action on the opposite side.
    if ( scene.lockedProperty && EqualityExplorerQueryParameters.lockVisible ) {
      const lockNode = new EqualityExplorerLockNode( scene.lockedProperty, {

        // offsets determined empirically, so that the body of the lock appears to be centered between the toolboxes
        centerX: leftTermsToolbox.right + ( rightTermsToolbox.left - leftTermsToolbox.right ) / 2 + 4,
        centerY: leftTermsToolbox.centerY - 5
      } );
      children.unshift( lockNode ); // add to beginning
    }

    // Render the drag bounds for the left and right plates
    if ( phet.chipper.queryParameters.dev ) {
      const dragBoundsOption = { stroke: 'red', lineWidth: 0.25 };
      children.push( new Rectangle( scene.leftDragBounds, dragBoundsOption ) );
      children.push( new Rectangle( scene.rightDragBounds, dragBoundsOption ) );
    }

    super( scene, sceneProperty, termsLayer, {
      children: children
    } );

    // @public (read-only) for layout only
    this.equationAccordionBox = equationAccordionBox;
    this.snapshotsAccordionBox = snapshotsAccordionBox;

    // @protected
    this.termsLayer = termsLayer;
  }
}

equalityExplorer.register( 'BasicsSceneNode', BasicsSceneNode );

export default BasicsSceneNode;