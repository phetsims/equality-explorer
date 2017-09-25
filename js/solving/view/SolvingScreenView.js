// Copyright 2017, University of Colorado Boulder

//TODO lots of duplication with VariablesScreenView
/**
 * View for the 'Solving' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var OperationNode = require( 'EQUALITY_EXPLORER/common/view/OperationNode' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var SceneNode = require( 'EQUALITY_EXPLORER/common/view/SceneNode' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var VariableAccordionBox = require( 'EQUALITY_EXPLORER/common/view/VariableAccordionBox' );

  /**
   * @param {SolvingModel} model
   * @constructor
   */
  function SolvingScreenView( model ) {

    ScreenView.call( this );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      right: this.layoutBounds.maxX - EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - EqualityExplorerConstants.SCREEN_VIEW_Y_MARGIN
    } );
    this.addChild( resetAllButton );

    // @private
    this.sceneNode = new SceneNode( model.scene, model.sceneProperty, this.layoutBounds, {
      itemsPanelSpacing: 30
    } );
    this.addChild( this.sceneNode );

    // Get the bounds of the Equation accordion box, relative to this ScreenView
    var globalBounds = this.sceneNode.equationAccordionBox.parentToGlobalBounds( this.sceneNode.equationAccordionBox.bounds );
    var localBounds = this.globalToLocalBounds( globalBounds );

    // Universal Operation, below Equation accordion box
    var operationNode = new OperationNode( model.operatorProperty, model.operandProperty, {
      centerX: model.scene.scale.location.x,
      top: localBounds.bottom + 10
    } );
    this.addChild( operationNode );

    // Get the bounds of the Snapshot accordion box, relative to this ScreenView
    globalBounds = this.sceneNode.snapshotsAccordionBox.parentToGlobalBounds( this.sceneNode.snapshotsAccordionBox.bounds );
    localBounds = this.globalToLocalBounds( globalBounds );

    // Variables accordion box, below the Snapshots accordion box
    var variableAccordionBox = new VariableAccordionBox( model.variableValueProperty, model.variableRange, {
      expandedProperty: this.variableAccordionBoxExpandedProperty,
      right: localBounds.right,
      top: localBounds.bottom + 10
    } );
    this.addChild( variableAccordionBox );
  }

  equalityExplorer.register( 'SolvingScreenView', SolvingScreenView );

  return inherit( ScreenView, SolvingScreenView );
} );