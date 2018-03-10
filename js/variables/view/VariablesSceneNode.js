// Copyright 2017-2018, University of Colorado Boulder

/**
 * A scene in the Variables screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var SceneNode = require( 'EQUALITY_EXPLORER/common/view/SceneNode' );
  var VariableAccordionBox = require( 'EQUALITY_EXPLORER/common/view/VariableAccordionBox' );

  /**
   * @param {Scene} scene
   * @param {Property.<Scene>} sceneProperty - the selected scene
   * @param {Bounds2} layoutBounds
   * @param {Object} [options]
   * @constructor
   */
  function VariablesSceneNode( scene, sceneProperty, layoutBounds, options ) {

    options = _.extend( {
      termsToolboxSpacing: 30 // horizontal spacing between terms in the toolbox
    }, options );

    // @private view-specific Properties
    this.viewProperties = {

      // whether the Variable accordion box is expanded or collapsed
      variableAccordionBoxExpandedProperty: new BooleanProperty( true ),

      // whether 'x' value is visible in snapshots
      xVisibleProperty: new BooleanProperty( true )
    };

    assert && assert( !options.xVisibleProperty, 'xVisibleProperty is set by this Node' );
    options.xVisibleProperty = this.viewProperties.xVisibleProperty;

    SceneNode.call( this, scene, sceneProperty, layoutBounds, options );

    // Get the bounds of the Snapshot accordion box, relative to this ScreenView
    var globalBounds = this.snapshotsAccordionBox.parentToGlobalBounds( this.snapshotsAccordionBox.bounds );
    var localBounds = this.globalToLocalBounds( globalBounds );

    // Variable accordion box, below the Snapshots accordion box
    var variableAccordionBox = new VariableAccordionBox( scene.xProperty, scene.xRange, {
      expandedProperty: this.viewProperties.variableAccordionBoxExpandedProperty,
      fixedWidth: this.snapshotsAccordionBox.width, // same width as Snapshots
      right: localBounds.right,
      top: localBounds.bottom + 15
    } );
    this.addChild( variableAccordionBox );
  }

  equalityExplorer.register( 'VariablesSceneNode', VariablesSceneNode );

  return inherit( SceneNode, VariablesSceneNode, {

    /**
     * @public
     * @override
     */
    reset: function() {

      // reset all view-specific Properties
      for ( var property in this.viewProperties ) {
        if ( this.viewProperties.hasOwnProperty( property ) ) {
          this.viewProperties[ property ].reset();
        }
      }

      SceneNode.prototype.reset.call( this );
    }
  } );
} );