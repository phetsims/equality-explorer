// Copyright 2017, University of Colorado Boulder

/**
 * Displays a scene in the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BalanceScaleNode = require( 'EQUALITY_EXPLORER/common/view/BalanceScaleNode' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerColors = require( 'EQUALITY_EXPLORER/common/EqualityExplorerColors' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var EquationAccordionBox = require( 'EQUALITY_EXPLORER/common/view/EquationAccordionBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemsPanel = require( 'EQUALITY_EXPLORER/common/view/ItemsPanel' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SnapshotsAccordionBox = require( 'EQUALITY_EXPLORER/common/view/SnapshotsAccordionBox' );

  /**
   * @param {BasicsScene} scene
   * @param {Property.<BasicsScene>} sceneProperty
   * @param {Bounds2} layoutBounds
   * @constructor
   */
  function BasicsSceneNode( scene, sceneProperty, layoutBounds ) {

    var self = this;

    // view-specific Properties
    this.equationAccordionBoxExpandedProperty = new Property( true );
    this.snapshotsAccordionBoxExpandedProperty = new Property( true );

    // Items live in this layer
    var itemsLayer = new Node();

    var scaleNode = new BalanceScaleNode( scene.scale );

    var leftItemsPanel = new ItemsPanel( scene.leftItemCreators, scene.scale.leftPlate, itemsLayer, {
      stroke: EqualityExplorerColors.LEFT_PLATE_COLOR,
      centerX: scene.scale.leftPlate.locationProperty.value.x,
      bottom: layoutBounds.bottom - EqualityExplorerConstants.SCREEN_VIEW_Y_MARGIN
    } );

    var rightItemsPanel = new ItemsPanel( scene.rightItemCreators, scene.scale.rightPlate, itemsLayer, {
      stroke: EqualityExplorerColors.RIGHT_PLATE_COLOR,
      centerX: scene.scale.rightPlate.locationProperty.value.x,
      bottom: leftItemsPanel.bottom
    } );

    var equationAccordionBox = new EquationAccordionBox(
      scene.leftItemCreators, scene.rightItemCreators, {
        expandedProperty: this.equationAccordionBoxExpandedProperty,

        // Slightly off center, so that the equation's relational operator is horizontally centered
        // above the scale's arrow. The offset was determined empirically.
        centerX: scene.scale.location.x - 15,
        top: layoutBounds.top + EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN
      } );

    var snapshotsAccordionBox = new SnapshotsAccordionBox( scene.leftItemCreators, scene.rightItemCreators, {
      maxWidth: ( layoutBounds.right - scaleNode.right ) - EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN - 15,
      expandedProperty: this.snapshotsAccordionBoxExpandedProperty,
      right: layoutBounds.right - EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN,
      top: layoutBounds.top + EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN
    } );

    Node.call( this, {
      children: [
        scaleNode,
        leftItemsPanel,
        rightItemsPanel,
        equationAccordionBox,
        snapshotsAccordionBox,
        itemsLayer // on top, so that Items are in front of everything else
      ]
    } );

    // Make this scene visible when it's selected, unlink unnecessary
    sceneProperty.link( function( newScene ) {
      self.visible = ( newScene === scene );
    } );

    // Render the drag bounds for the left and right plates
    if ( EqualityExplorerQueryParameters.showDragBounds ) {

      // left
      this.addChild( new Rectangle(
        scene.leftDragBounds.minX, scene.leftDragBounds.minY,
        scene.leftDragBounds.width, scene.leftDragBounds.height, {
          stroke: EqualityExplorerColors.LEFT_PLATE_COLOR,
          lineDash: [ 2, 6 ]
        } ) );

      // right
      this.addChild( new Rectangle(
        scene.rightDragBounds.minX, scene.rightDragBounds.minY,
        scene.rightDragBounds.width, scene.rightDragBounds.height, {
          stroke: EqualityExplorerColors.RIGHT_PLATE_COLOR,
          lineDash: [ 2, 6 ]
        } ) );
    }
  }

  equalityExplorer.register( 'BasicsSceneNode', BasicsSceneNode );

  return inherit( Node, BasicsSceneNode, {

    // @public
    reset: function() {
      this.equationAccordionBoxExpandedProperty.reset();
      this.snapshotsAccordionBoxExpandedProperty.reset();
    }
  } );
} );
