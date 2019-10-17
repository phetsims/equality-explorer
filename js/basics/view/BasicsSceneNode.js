// Copyright 2017-2019, University of Colorado Boulder

/**
 * View of a scene in the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BalanceScaleNode = require( 'EQUALITY_EXPLORER/common/view/BalanceScaleNode' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  const EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  const EqualityExplorerSceneNode = require( 'EQUALITY_EXPLORER/common/view/EqualityExplorerSceneNode' );
  const EquationAccordionBox = require( 'EQUALITY_EXPLORER/common/view/EquationAccordionBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const LockControl = require( 'EQUALITY_EXPLORER/common/view/LockControl' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const SnapshotsAccordionBox = require( 'EQUALITY_EXPLORER/common/view/SnapshotsAccordionBox' );
  const TermsToolbox = require( 'EQUALITY_EXPLORER/common/view/TermsToolbox' );

  /**
   * @param {EqualityExplorerScene} scene
   * @param {Property.<EqualityExplorerScene>} sceneProperty - the selected scene
   * @param {BooleanProperty} equationAccordionBoxExpandedProperty
   * @param {BooleanProperty} snapshotsAccordionBoxExpandedProperty
   * @param {Bounds2} layoutBounds
   * @param {Object} [options]
   * @constructor
   */
  function BasicsSceneNode( scene, sceneProperty, equationAccordionBoxExpandedProperty,
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

    // @protected terms live in this layer
    this.termsLayer = new Node();

    const scaleNode = new BalanceScaleNode( scale, {
      organizeButtonVisible: options.organizeButtonVisible,
      disposeTermsNotOnScale: scene.disposeTermsNotOnScale.bind( scene )
    } );

    const leftTermsToolbox = new TermsToolbox( leftTermCreators, scale.leftPlate, this.termsLayer, {
      hasNegativeTermsInToolbox: options.hasNegativeTermsInToolbox,
      contentSize: options.termsToolboxContentSize,
      spacing: options.termsToolboxSpacing,
      centerX: scale.leftPlate.locationProperty.value.x,
      bottom: layoutBounds.bottom - EqualityExplorerConstants.SCREEN_VIEW_Y_MARGIN
    } );

    const rightTermsToolbox = new TermsToolbox( rightTermCreators, scale.rightPlate, this.termsLayer, {
      hasNegativeTermsInToolbox: options.hasNegativeTermsInToolbox,
      contentSize: options.termsToolboxContentSize,
      spacing: options.termsToolboxSpacing,
      centerX: scale.rightPlate.locationProperty.value.x,
      bottom: leftTermsToolbox.bottom
    } );

    const equationAccordionBox = new EquationAccordionBox( leftTermCreators, rightTermCreators, {
      fixedWidth: Math.floor( rightTermsToolbox.right - leftTermsToolbox.left ),
      expandedProperty: equationAccordionBoxExpandedProperty,

      // Slightly off center, so that the equation's relational operator is horizontally centered
      // above the scale's arrow. The offset was determined empirically.
      centerX: scale.location.x - 15,
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
      this.termsLayer // on top, so that terms are in front of everything else
    ];

    // Some scenes support locking the left and right sides of the equation,
    // such that an action on one side results in an equivalent action on the opposite side.
    if ( scene.lockedProperty && EqualityExplorerQueryParameters.lockVisible ) {
      const lockControl = new LockControl( scene.lockedProperty, {
        x: scale.location.x,
        y: leftTermsToolbox.centerY - 5 // offset determined empirically
      } );
      children.unshift( lockControl ); // add to beginning
    }

    // Render the drag bounds for the left and right plates
    if ( phet.chipper.queryParameters.dev ) {
      const dragBoundsOption = { stroke: 'red', lineWidth: 0.25 };
      children.push( new Rectangle( scene.leftDragBounds, dragBoundsOption ) );
      children.push( new Rectangle( scene.rightDragBounds, dragBoundsOption ) );
    }

    EqualityExplorerSceneNode.call( this, scene, sceneProperty, this.termsLayer, {
      children: children
    } );

    // @public (read-only) for layout only
    this.equationAccordionBox = equationAccordionBox;
    this.snapshotsAccordionBox = snapshotsAccordionBox;
  }

  equalityExplorer.register( 'BasicsSceneNode', BasicsSceneNode );

  return inherit( EqualityExplorerSceneNode, BasicsSceneNode );
} );
