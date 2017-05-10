// Copyright 2017, University of Colorado Boulder

/**
 * Displays a scene in the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerColors = require( 'EQUALITY_EXPLORER/common/EqualityExplorerColors' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var EquationAccordionBox = require( 'EQUALITY_EXPLORER/common/view/EquationAccordionBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemPanel = require( 'EQUALITY_EXPLORER/common/view/ItemPanel' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ScaleNode = require( 'EQUALITY_EXPLORER/common/view/ScaleNode' );
  var SnapshotsAccordionBox = require( 'EQUALITY_EXPLORER/common/view/SnapshotsAccordionBox' );

  /**
   * @param {BasicsScene} scene
   * @param {Property.<BasicsScene>} sceneProperty
   * @param {Bounds2} layoutBounds
   * @param {Object} [options]
   * @constructor
   */
  function BasicsSceneNode( scene, sceneProperty, layoutBounds, options ) {

    options = options || {};

    var self = this;

    var snapshotsAccordionBox = new SnapshotsAccordionBox( {
      expandedProperty: scene.snapshotsAccordionBoxExpandedProperty,
      right: layoutBounds.right - EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN,
      top: layoutBounds.top + EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN
    } );

    var equationAccordionBox = new EquationAccordionBox( {
      expandedProperty: scene.equationAccordionBoxExpandedProperty,
      centerX: layoutBounds.left + ( snapshotsAccordionBox.left - layoutBounds.left ) / 2,
      top: layoutBounds.top + EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN
    } );

    var leftItemPanel = new ItemPanel( {
      stroke: EqualityExplorerColors.LEFT_PLATE_COLOR,
      right: equationAccordionBox.centerX - 40,
      bottom: layoutBounds.bottom - EqualityExplorerConstants.SCREEN_VIEW_Y_MARGIN
    } );

    var rightItemPanel = new ItemPanel( {
      stroke: EqualityExplorerColors.RIGHT_PLATE_COLOR,
      left: equationAccordionBox.centerX + 40,
      bottom: leftItemPanel.bottom
    } );

    var scaleNode = new ScaleNode( scene.scaleAngleProperty, {
      centerX: equationAccordionBox.centerX,
      bottom: leftItemPanel.top - 30
    } );

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [ snapshotsAccordionBox, equationAccordionBox, leftItemPanel, rightItemPanel, scaleNode ];

    Node.call( this, options );

    // unlink not needed, BasicsSceneNodeNode exists for lifetime of the sim
    sceneProperty.link( function( newScene ) {
      self.visible = ( newScene === scene );
    } );
  }

  equalityExplorer.register( 'BasicsSceneNode', BasicsSceneNode );

  return inherit( Node, BasicsSceneNode );
} );
