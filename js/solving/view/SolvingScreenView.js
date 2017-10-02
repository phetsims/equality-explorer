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
  var Property = require( 'AXON/Property' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var SceneNode = require( 'EQUALITY_EXPLORER/common/view/SceneNode' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var VariableAccordionBox = require( 'EQUALITY_EXPLORER/common/view/VariableAccordionBox' );

  /**
   * @param {SolvingModel} model
   * @constructor
   */
  function SolvingScreenView( model ) {

    var self = this;

    // @private view-specific Properties
    this.viewProperties = {

      // whether the Variable accordion box is expanded or collapsed
      variableAccordionBoxExpandedProperty: new Property( true ),

      // whether 'x' value is visible in snapshots
      xVisibleProperty: new Property( true )
    };

    ScreenView.call( this );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
        self.reset();
      },
      right: this.layoutBounds.maxX - EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - EqualityExplorerConstants.SCREEN_VIEW_Y_MARGIN
    } );
    this.addChild( resetAllButton );

    // @private
    this.sceneNode = new SceneNode( model.scene, this.layoutBounds, {
      xVisibleProperty: this.viewProperties.xVisibleProperty,
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
      expandedProperty: this.viewProperties.variableAccordionBoxExpandedProperty,
      maxWidth: this.sceneNode.snapshotsAccordionBox.maxWidth, // same width as Snapshots
      right: localBounds.right,
      top: localBounds.bottom + 15
    } );
    this.addChild( variableAccordionBox );
  }

  equalityExplorer.register( 'SolvingScreenView', SolvingScreenView );

  return inherit( ScreenView, SolvingScreenView, {

    // @public
    reset: function() {

      // reset all view-specific Properties
      for ( var property in this.viewProperties ) {
        if ( this.viewProperties.hasOwnProperty( property ) ) {
          this.viewProperties[ property ].reset();
        }
      }

      // reset the scene's view
      this.sceneNode.reset();
    }
  } );
} );