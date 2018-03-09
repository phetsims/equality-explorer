// Copyright 2017-2018, University of Colorado Boulder

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
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Plate = require( 'EQUALITY_EXPLORER/common/model/Plate' );
  var SceneNode = require( 'EQUALITY_EXPLORER/common/view/SceneNode' );
  var SumToZeroNode = require( 'EQUALITY_EXPLORER/common/view/SumToZeroNode' );
  var UniversalOperationControl = require( 'EQUALITY_EXPLORER/common/view/UniversalOperationControl' );
  var Util = require( 'DOT/Util' );
  var VariableAccordionBox = require( 'EQUALITY_EXPLORER/common/view/VariableAccordionBox' );

  /**
   * @param {Scene} scene
   * @param {Property.<Scene>} sceneProperty - the selected scene
   * @param {Bounds2} layoutBounds
   * @param {Object} [options]
   * @constructor
   */
  function SolvingSceneNode( scene, sceneProperty, layoutBounds, options ) {

    var self = this;

    options = _.extend( {
      termsPanelSpacing: 30,
      organizeButtonVisible: false
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
    operationNode.moveToBack();

    // Put animation layer on top of everything
    this.addChild( operationAnimationLayer );

    // @private fields needed by prototype functions
    this.operationNode = operationNode;

    // Perform sum-to-zero animation for any terms that became zero as the result of a universal operation.
    scene.sumToZeroEmitter.addListener(
      // @param {{ plate: Plate, cellIndex: number, symbol: string|null }[]} sumToZeroData
      function( sumToZeroData ) {

        for ( var i = 0; i < sumToZeroData.length; i++ ) {

          // data structure that describes a term that became zero
          var data = sumToZeroData[ i ];
          assert && assert( data.plate instanceof Plate, 'invalid plate: ' + data.plate );
          assert && assert( Util.isInteger( data.cellIndex ), 'invalid cellIndex: ' + data.cellIndex );
          assert && assert( ( typeof data.symbol === 'string' ) || ( data.symbol === null ), 'invalid symbol: ' + data.symbol );

          // determine where the cell that contained the term is currently located
          var cellCenter = data.plate.getLocationOfCell( data.cellIndex );

          // display the animation in that cell
          var sumToZeroNode = new SumToZeroNode( {
            symbol: data.symbol,
            center: cellCenter
          } );
          self.termsLayer.addChild( sumToZeroNode );
          sumToZeroNode.startAnimation();
        }
      } );
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