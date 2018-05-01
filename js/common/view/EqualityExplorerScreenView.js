// Copyright 2017-2018, University of Colorado Boulder

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
       * @param {Object} [options]
       * @returns {Node}
       */
      createSceneNode: function( scene, sceneProperty, layoutBounds, options ) {
        return new SceneNode( scene, sceneProperty, layoutBounds, options );
      },

      // {boolean} if true, put negative terms in the toolbox, e.g. -x
      hasNegativeTermsInToolbox: true
    }, options );

    ScreenView.call( this );

    var resetAllButton = new ResetAllButton( {
      listener: function() {
        phet.log && phet.log( 'ResetAllButton pressed' );
        model.reset();
        self.reset();
      },
      right: this.layoutBounds.maxX - EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - EqualityExplorerConstants.SCREEN_VIEW_Y_MARGIN
    } );
    this.addChild( resetAllButton );

    // @private {Scene[]} create the view for each scene
    this.sceneNodes = [];
    model.scenes.forEach( function( scene ) {
      var sceneNode = options.createSceneNode( scene, model.sceneProperty, self.layoutBounds, {
        hasNegativeTermsInToolbox: options.hasNegativeTermsInToolbox
      } );
      self.sceneNodes.push( sceneNode );
      self.addChild( sceneNode );
    } );

    // If the model has more than 1 scene, create a control for scene selection.
    if ( model.scenes.length > 1 ) {

      // Get the bounds of the Snapshot accordion box, relative to this ScreenView
      var snapshotsAccordionBox = this.sceneNodes[ 0 ].snapshotsAccordionBox;

      // Center the scene control in the space below the Snapshots accordion box
      var sceneControl = new SceneControl( model.scenes, model.sceneProperty, {
        centerX: snapshotsAccordionBox.centerX,
        centerY: snapshotsAccordionBox.bottom + ( resetAllButton.top - snapshotsAccordionBox.bottom ) / 2
      } );
      this.addChild( sceneControl );
    }

    // Make the selected scene visible. unlink not needed.
    model.sceneProperty.link( function( scene ) {
      for ( var i = 0; i < self.sceneNodes.length; i++ ) {
        self.sceneNodes[ i ].visible = ( self.sceneNodes[ i ].scene === scene );
      }
    } );
  }

  equalityExplorer.register( 'EqualityExplorerScreenView', EqualityExplorerScreenView );

  return inherit( ScreenView, EqualityExplorerScreenView, {

    // @public
    reset: function() {
      this.sceneNodes.forEach( function( sceneNode ) {
        sceneNode.reset();
      } );
    },

    /**
     * @param {number} dt - elapsed time, in seconds
     * @public
     */
    step: function( dt ) {

      // animate the view for the selected scene
      for ( var i = 0; i < this.sceneNodes.length; i++ ) {
        var sceneNode = this.sceneNodes[ i ];
        if ( sceneNode.visible ) {
          sceneNode.step && sceneNode.step( dt );
          break;
        }
      }
    }
  } );
} );