// Copyright 2017-2018, University of Colorado Boulder

//TODO duplication with VariablesSceneNode. Should this be a subtype of VariablesSceneNode?
/**
 * A scene in the Operations screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
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
  function OperationsSceneNode( scene, sceneProperty, layoutBounds, options ) {

    var self = this;

    options = _.extend( {
      termsToolboxSpacing: 30, // horizontal space between terms in the toolboxes
      organizeButtonVisible: false // like terms are combines, so the organize button is not relevant in this screen
    }, options );

    // @private view-specific Properties
    this.viewProperties = {

      // whether the Variable accordion box is expanded or collapsed
      variableAccordionBoxExpandedProperty: new BooleanProperty( true ),

      // whether 'x' value is visible in snapshots
      xVisibleProperty: new BooleanProperty( true )
    };

    assert && assert( !options.xVisibleProperty, 'OperationsSceneNode sets xVisibleProperty' );
    options.xVisibleProperty = this.viewProperties.xVisibleProperty;

    SceneNode.call( this, scene, sceneProperty, layoutBounds, options );

    // Get the bounds of the Snapshot accordion box, relative to this ScreenView
    var globalBounds = this.snapshotsAccordionBox.parentToGlobalBounds( this.snapshotsAccordionBox.bounds );
    var localBounds = this.globalToLocalBounds( globalBounds );

    // Variables accordion box, below the Snapshots accordion box
    var variableAccordionBox = new VariableAccordionBox( scene.xVariable, {
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

    // @private Universal Operation, below Equation accordion box
    this.universalOperationControl = new UniversalOperationControl( scene, operationAnimationLayer, {
      centerX: scene.scale.location.x, // centered on the scale
      top: localBounds.bottom + 10
    } );
    this.addChild( this.universalOperationControl );
    this.universalOperationControl.moveToBack();

    // Put animation layer on top of everything
    this.addChild( operationAnimationLayer );

    // Perform sum-to-zero animation for any terms that became zero as the result of a universal operation.
    scene.sumToZeroEmitter.addListener(
      // @param {{ plate: Plate, cellIndex: number, symbol: string|null }[]} sumToZeroData
      function( sumToZeroData ) {

        for ( var i = 0; i < sumToZeroData.length; i++ ) {

          // data structure that describes a term that became zero
          var data = sumToZeroData[ i ];
          assert && assert( data.plate instanceof Plate, 'invalid plate: ' + data.plate );
          assert && assert( Util.isInteger( data.cellIndex ), 'cellIndex must be an integer: ' + data.cellIndex );
          assert && assert( ( typeof data.symbol === 'string' ) || ( data.symbol === null ),
            'invalid symbol: ' + data.symbol );

          // determine where the cell that contained the term is currently located
          var cellCenter = data.plate.getLocationOfCell( data.cellIndex );

          // display the animation in that cell
          var sumToZeroNode = new SumToZeroNode( {
            symbol: data.symbol,
            center: cellCenter,
            fontSize: EqualityExplorerConstants.SUM_TO_ZERO_BIG_FONT_SIZE
          } );
          self.termsLayer.addChild( sumToZeroNode );
          sumToZeroNode.startAnimation();
        }
      } );
  }

  equalityExplorer.register( 'OperationsSceneNode', OperationsSceneNode );

  return inherit( SceneNode, OperationsSceneNode, {

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

      // universal operation control has Properties and animations that may be in progress
      this.universalOperationControl.reset();

      SceneNode.prototype.reset.call( this );
    }
  } );
} );