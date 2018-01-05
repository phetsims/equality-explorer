// Copyright 2017, University of Colorado Boulder

/**
 * Base type for displaying scenes in Equality Explorer.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BalanceScaleNode = require( 'EQUALITY_EXPLORER/common/view/BalanceScaleNode' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var EquationAccordionBox = require( 'EQUALITY_EXPLORER/common/view/EquationAccordionBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemsPanel = require( 'EQUALITY_EXPLORER/common/view/ItemsPanel' );
  var LockControl = require( 'EQUALITY_EXPLORER/common/view/LockControl' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SnapshotsAccordionBox = require( 'EQUALITY_EXPLORER/common/view/SnapshotsAccordionBox' );

  /**
   * @param {Scene} scene
   * @param {Property.<Scene>} sceneProperty - the selected scene
   * @param {Bounds2} layoutBounds
   * @param {Object} [options]
   * @constructor
   */
  function SceneNode( scene, sceneProperty, layoutBounds, options ) {

    var self = this;

    options = _.extend( {
      itemsPanelSpacing: 50, // spacing of items in the panels that appear below the scale
      xVisibleProperty: null, // {BooleanProperty|null} whether 'x' value is visible in snapshots
      organizeButtonVisible: true
    }, options );

    // view-specific Properties
    this.equationAccordionBoxExpandedProperty = new BooleanProperty( true );
    this.snapshotsAccordionBoxExpandedProperty = new BooleanProperty( true );

    // locals vars to improve readability
    var scale = scene.scale;
    var leftItemCreators = scene.leftItemCreators;
    var rightItemCreators = scene.rightItemCreators;

    // items live in this layer
    var itemsLayer = new Node();

    var scaleNode = new BalanceScaleNode( scale, {
      organizeButtonVisible: options.organizeButtonVisible
    } );

    var leftItemsPanel = new ItemsPanel( leftItemCreators, scale.leftPlate, itemsLayer, {
      spacing: options.itemsPanelSpacing,
      centerX: scale.leftPlate.locationProperty.value.x,
      bottom: layoutBounds.bottom - EqualityExplorerConstants.SCREEN_VIEW_Y_MARGIN
    } );

    var rightItemsPanel = new ItemsPanel( rightItemCreators, scale.rightPlate, itemsLayer, {
      spacing: options.itemsPanelSpacing,
      centerX: scale.rightPlate.locationProperty.value.x,
      bottom: leftItemsPanel.bottom
    } );

    var equationAccordionBox = new EquationAccordionBox( leftItemCreators, rightItemCreators, {
      fixedWidth: rightItemsPanel.right - leftItemsPanel.left,
      expandedProperty: this.equationAccordionBoxExpandedProperty,

      // Slightly off center, so that the equation's relational operator is horizontally centered
      // above the scale's arrow. The offset was determined empirically.
      centerX: scale.location.x - 15,
      top: layoutBounds.top + EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN
    } );

    var snapshotsAccordionBox = new SnapshotsAccordionBox( scene, {
      xVisibleProperty: options.xVisibleProperty,
      fixedWidth: ( layoutBounds.right - scaleNode.right ) - EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN - 15,
      expandedProperty: this.snapshotsAccordionBoxExpandedProperty,
      right: layoutBounds.right - EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN,
      top: layoutBounds.top + EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN
    } );

    var children = [
      scaleNode,
      leftItemsPanel,
      rightItemsPanel,
      equationAccordionBox,
      snapshotsAccordionBox,
      itemsLayer // on top, so that items are in front of everything else
    ];

    // Some scenes support locking the left and right sides of the equation,
    // such that an action on one side results in an equivalent action on the opposite side.
    if ( scene.lockedProperty ) {
      var lockControl = new LockControl( scene.lockedProperty, {
        visible: false, //TODO delete after deploying interview version
        x: scale.location.x,
        y: leftItemsPanel.centerY - 5 // offset determined empirically
      } );
      children.unshift( lockControl ); // add to beginning
    }

    Node.call( this, {
      children: children
    } );

    // Make this scene visible when it's selected, unlink unnecessary
    sceneProperty.link( function( newScene ) {
      self.visible = ( newScene === scene );
    } );

    // Render the drag bounds for the left and right plates
    if ( EqualityExplorerQueryParameters.showDragBounds ) {
      this.addChild( new Rectangle( scene.leftDragBounds, { stroke: 'red' } ) );
      this.addChild( new Rectangle( scene.rightDragBounds, { stroke: 'red' } ) );
    }

    // @public (read-only) for layout only
    this.equationAccordionBox = equationAccordionBox;
    this.snapshotsAccordionBox = snapshotsAccordionBox;
  }

  equalityExplorer.register( 'SceneNode', SceneNode );

  return inherit( Node, SceneNode, {

    // @public
    reset: function() {
      this.equationAccordionBoxExpandedProperty.reset();
      this.snapshotsAccordionBoxExpandedProperty.reset();
    }
  } );
} );
