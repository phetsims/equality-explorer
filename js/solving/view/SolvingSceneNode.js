// Copyright 2017, University of Colorado Boulder

//TODO lots of duplication with SolvingSceneNode
/**
 * A scene in the Solving screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var SceneNode = require( 'EQUALITY_EXPLORER/common/view/SceneNode' );
  var UniversalOperationNode = require( 'EQUALITY_EXPLORER/common/view/UniversalOperationNode' );
  var VariableAccordionBox = require( 'EQUALITY_EXPLORER/common/view/VariableAccordionBox' );

  /**
   * @param {Scene} scene
   * @param {Bounds2} layoutBounds
   * @param {Object} [options]
   * @constructor
   */
  function SolvingSceneNode( scene, layoutBounds, options ) {

    options = _.extend( {
      itemsPanelSpacing: 30,
      organizeButtonVisible: false
    }, options );

    // @private view-specific Properties
    this.viewProperties = {

      // whether the Variable accordion box is expanded or collapsed
      variableAccordionBoxExpandedProperty: new Property( true ),

      // whether 'x' value is visible in snapshots
      xVisibleProperty: new Property( true )
    };

    assert && assert( !options.xVisibleProperty, 'this type defines its xVisibleProperty' );
    options.xVisibleProperty = this.viewProperties.xVisibleProperty;

    SceneNode.call( this, scene, layoutBounds, options );

    // Get the bounds of the Snapshot accordion box, relative to this ScreenView
    var globalBounds = this.snapshotsAccordionBox.parentToGlobalBounds( this.snapshotsAccordionBox.bounds );
    var localBounds = this.globalToLocalBounds( globalBounds );

    // Variables accordion box, below the Snapshots accordion box
    var variableAccordionBox = new VariableAccordionBox( scene.xProperty, scene.xRange, {
      expandedProperty: this.viewProperties.variableAccordionBoxExpandedProperty,
      fixedWidth: this.snapshotsAccordionBox.width, // same width as Snapshots
      right: localBounds.right,
      top: localBounds.bottom + 15
    } );
    this.addChild( variableAccordionBox );

    // Get the bounds of the Equation accordion box, relative to this ScreenView
    globalBounds = this.equationAccordionBox.parentToGlobalBounds( this.equationAccordionBox.bounds );
    localBounds = this.globalToLocalBounds( globalBounds );

    // Universal Operation, below Equation accordion box
    var operationNode = new UniversalOperationNode(
      scene.operatorProperty, scene.operators,
      scene.operandProperty, scene.operandRange, {
        centerX: scene.scale.location.x,
        top: localBounds.bottom + 10
      } );
    this.addChild( operationNode );
  }

  equalityExplorer.register( 'SolvingSceneNode', SolvingSceneNode );

  return inherit( SceneNode, SolvingSceneNode, {

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