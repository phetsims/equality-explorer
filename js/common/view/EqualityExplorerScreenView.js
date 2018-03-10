// Copyright 2017, University of Colorado Boulder

/**
 * Base type for ScreenViews in the Equality Explorer sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var SceneControl = require( 'EQUALITY_EXPLORER/common/view/SceneControl' );
  var SceneNode = require( 'EQUALITY_EXPLORER/common/view/SceneNode' );
  var ScreenView = require( 'JOIST/ScreenView' );

  /**
   * @param {EqualityExplorerModel} model
   * @param {Object} [options]
   * @constructor
   */
  function EqualityExplorerScreenView( model, options ) {

    var self = this;

    options = _.extend( {

      /**
       * Creates the Node for a Scene
       * @param {Scene} scene
       * @param {Property.<Scene>} sceneProperty - the selected Scene
       * @param {Bounds2} layoutBounds
       * @returns {Node}
       */
      createSceneNode: function( scene, sceneProperty, layoutBounds ) {
        return new SceneNode( scene, sceneProperty, layoutBounds );
      }
    }, options );

    ScreenView.call( this );

    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
        self.reset();
      },
      right: this.layoutBounds.maxX - EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - EqualityExplorerConstants.SCREEN_VIEW_Y_MARGIN
    } );
    this.addChild( resetAllButton );

    // @private create the view for each scene
    this.sceneNodes = [];
    model.scenes.forEach( function( scene ) {
      var sceneNode = options.createSceneNode( scene, model.sceneProperty, self.layoutBounds );
      self.sceneNodes.push( sceneNode );
      self.addChild( sceneNode );
    } );

    // If the model has more than 1 scene, create a control for scene selection.
    if ( model.scenes.length > 1 ) {

      // Get the bounds of the Snapshot accordion box, relative to this ScreenView
      var sceneNode = this.sceneNodes[ 0 ];
      var globalBounds = sceneNode.snapshotsAccordionBox.parentToGlobalBounds( sceneNode.snapshotsAccordionBox.bounds );
      var localBounds = this.globalToLocalBounds( globalBounds );

      // Center the scene control in the space below the Snapshots accordion box
      var sceneControl = new SceneControl( model.scenes, model.sceneProperty, {
        centerX: localBounds.centerX,
        centerY: localBounds.bottom + ( resetAllButton.top - localBounds.bottom ) / 2
      } );
      this.addChild( sceneControl );
    }
  }

  equalityExplorer.register( 'EqualityExplorerScreenView', EqualityExplorerScreenView );

  return inherit( ScreenView, EqualityExplorerScreenView, {

    // @public
    reset: function() {
      this.sceneNodes.forEach( function( sceneNode ) {
        sceneNode.reset();
      } );
    }
  } );
} );