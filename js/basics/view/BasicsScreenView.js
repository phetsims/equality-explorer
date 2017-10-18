// Copyright 2017, University of Colorado Boulder

/**
 * View for the 'Basics' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerScreenView = require( 'EQUALITY_EXPLORER/common/view/EqualityExplorerScreenView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var SceneControl = require( 'EQUALITY_EXPLORER/common/view/SceneControl' );
  var SceneNode = require( 'EQUALITY_EXPLORER/common/view/SceneNode' );

  /**
   * @param {BasicsModel} model
   * @constructor
   */
  function BasicsScreenView( model ) {

    EqualityExplorerScreenView.call( this, model );

    // @private create the view for each scene
    this.sceneNodes = [];
    var sceneNode;
    for ( var i = 0; i < model.scenes.length; i++ ) {
      sceneNode = new SceneNode( model.scenes[ i ], this.layoutBounds, {
        showWorstCaseEquation: true, //TODO delete this
        sceneProperty: model.sceneProperty,
        coupledSwitchVisible: false
      } );
      this.sceneNodes.push( sceneNode );
      this.addChild( sceneNode );
    }

    // Get the bounds of the Snapshot accordion box, relative to this ScreenView
    var globalBounds = sceneNode.snapshotsAccordionBox.parentToGlobalBounds( sceneNode.snapshotsAccordionBox.bounds );
    var localBounds = this.globalToLocalBounds( globalBounds );

    // Center the scene control in the space below the Snapshots accordion box  
    var sceneControl = new SceneControl( model.scenes, model.sceneProperty, {
      centerX: localBounds.centerX,
      centerY: localBounds.bottom + ( this.resetAllButton.top - localBounds.bottom ) / 2
    } );
    this.addChild( sceneControl );
  }

  equalityExplorer.register( 'BasicsScreenView', BasicsScreenView );

  return inherit( EqualityExplorerScreenView, BasicsScreenView, {

    /**
     * Resets things that are specific to the view.
     * @public
     * @override
     */
    reset: function() {
      for ( var i = 0; i < this.sceneNodes.length; i++ ) {
        this.sceneNodes[ i ].reset();
      }
      EqualityExplorerScreenView.prototype.reset.call( this );
    }
  } );
} );