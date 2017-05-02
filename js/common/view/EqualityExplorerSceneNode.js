// Copyright 2017, University of Colorado Boulder

/**
 * Displays a scene in Equality Explorer.
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
  var OrganizeButton = require( 'EQUALITY_EXPLORER/common/view/OrganizeButton' );
  var ScaleNode = require( 'EQUALITY_EXPLORER/common/view/ScaleNode' );
  var SnapshotsAccordionBox = require( 'EQUALITY_EXPLORER/common/view/SnapshotsAccordionBox' );
  var VariableAccordionBox = require( 'EQUALITY_EXPLORER/common/view/VariableAccordionBox' );

  /**
   * @param {EqualityExplorerScene} scene
   * @param {Property.<EqualityExplorerScene>} sceneProperty
   * @param {Bounds2} layoutBounds
   * @param {Object} [options]
   * @constructor
   */
  function EqualityExplorerSceneNode( scene, sceneProperty, layoutBounds, options ) {

    options = options || {};

    var self = this;

    var snapshotsAccordionBox = new SnapshotsAccordionBox( {
      right: layoutBounds.right - EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN,
      top: layoutBounds.top + EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN
    } );

    var variableAccordionBox = new VariableAccordionBox( scene.variableValueProperty, scene.variableRange, {
      top: snapshotsAccordionBox.bottom + 10,
      right: snapshotsAccordionBox.right
    } );

    var organizeButton = new OrganizeButton( {
      left: variableAccordionBox.left,
      top: variableAccordionBox.bottom + 10
    } );

    var equationAccordionBox = new EquationAccordionBox( {
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
    options.children = [
      snapshotsAccordionBox, variableAccordionBox, organizeButton,
      equationAccordionBox, leftItemPanel, rightItemPanel, scaleNode
    ];

    Node.call( this, options );

    // unlink not needed, EqualityExplorerSceneNode exists for lifetime of the sim
    sceneProperty.link( function( newScene ) {
      self.visible = ( newScene === scene );
    } );
  }

  equalityExplorer.register( 'EqualityExplorerSceneNode', EqualityExplorerSceneNode );

  return inherit( Node, EqualityExplorerSceneNode );
} );
