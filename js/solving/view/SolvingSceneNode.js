// Copyright 2017, University of Colorado Boulder

//TODO lots of duplication with VariablesSceneNode
/**
 * A scene in the Solving screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var ConstantTermNode = require( 'EQUALITY_EXPLORER/solving/view/ConstantTermNode' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var SceneNode = require( 'EQUALITY_EXPLORER/common/view/SceneNode' );
  var UniversalOperationControl = require( 'EQUALITY_EXPLORER/solving/view/UniversalOperationControl' );
  var VariableAccordionBox = require( 'EQUALITY_EXPLORER/common/view/VariableAccordionBox' );
  var VariableTermNode = require( 'EQUALITY_EXPLORER/solving/view/VariableTermNode' );

  /**
   * @param {Scene} scene
   * @param {Property.<Scene>} sceneProperty - the selected scene
   * @param {Bounds2} layoutBounds
   * @param {Object} [options]
   * @constructor
   */
  function SolvingSceneNode( scene, sceneProperty, layoutBounds, options ) {

    options = _.extend( {
      itemsPanelSpacing: 30,
      organizeButtonVisible: false
    }, options );

    // @private view-specific Properties
    this.viewProperties = {

      // whether the Variable accordion box is expanded or collapsed
      variableAccordionBoxExpandedProperty: new BooleanProperty( true ),

      // whether 'x' value is visible in snapshots
      xVisibleProperty: new BooleanProperty( true )
    };

    assert && assert( !options.xVisibleProperty, 'this type defines its xVisibleProperty' );
    options.xVisibleProperty = this.viewProperties.xVisibleProperty;

    SceneNode.call( this, scene, sceneProperty, layoutBounds, options );

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

    // Layer when universal operation animation occurs
    var operationAnimationLayer = new Node();

    // Universal Operation, below Equation accordion box
    var operationNode = new UniversalOperationControl( scene, operationAnimationLayer, {
      centerX: scene.scale.location.x,
      top: localBounds.bottom + 10
    } );
    this.addChild( operationNode );

    // Terms on left side of the scale
    var leftVariableTermNode = new VariableTermNode( scene.leftVariableTerm );
    this.addChild( leftVariableTermNode );
    var leftConstantTermNode = new ConstantTermNode( scene.leftConstantTerm );
    this.addChild( leftConstantTermNode );

    // Terms on right side of the scale
    var rightVariableTermNode = new VariableTermNode( scene.rightVariableTerm );
    this.addChild( rightVariableTermNode );
    var rightConstantTermNode = new ConstantTermNode( scene.rightConstantTerm );
    this.addChild( rightConstantTermNode );

    // Put animation layer on top of everything
    this.addChild( operationAnimationLayer );

    // @private fields needed by prototype functions
    this.operationNode = operationNode;
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

      // reset the universal operator, to cancel any operation animations that are in progress
      this.operationNode.reset();

      SceneNode.prototype.reset.call( this );
    }
  } );
} );