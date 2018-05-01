// Copyright 2017-2018, University of Colorado Boulder

/**
 * View of a scene in the 'Operations' screen.
 * Like the scene in the 'Variables' screen, but with an added control for applying a universal operation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ArielOperationControl = require( 'EQUALITY_EXPLORER/common/view/ArielOperationControl' );
  var VariablesSceneNode = require( 'EQUALITY_EXPLORER/variables/view/VariablesSceneNode' );

  /**
   * @param {Scene} scene
   * @param {Property.<Scene>} sceneProperty - the selected scene
   * @param {Bounds2} layoutBounds
   * @param {Object} [options]
   * @constructor
   */
  function OperationsSceneNode( scene, sceneProperty, layoutBounds, options ) {

    options = _.extend( {
      organizeButtonVisible: false // like terms are combines, so the organize button is not relevant in this screen
    }, options );

    VariablesSceneNode.call( this, scene, sceneProperty, layoutBounds, options );

    // Layer when universal operation animation occurs
    var operationAnimationLayer = new Node();

    // @private Universal Operation, below Equation accordion box
    this.universalOperationControl = new ArielOperationControl( scene, operationAnimationLayer, {
      centerX: scene.scale.location.x, // centered on the scale
      top: this.equationAccordionBox.bottom + 10
    } );
    this.addChild( this.universalOperationControl );
    this.universalOperationControl.moveToBack();

    // Put animation layer on top of everything
    this.addChild( operationAnimationLayer );

    // Perform sum-to-zero animation for any terms that became zero as the result of a universal operation.
    // removeListener not needed.
    scene.sumToZeroEmitter.addListener( this.animateSumToZero.bind( this ) );
  }

  equalityExplorer.register( 'OperationsSceneNode', OperationsSceneNode );

  return inherit( VariablesSceneNode, OperationsSceneNode, {

    /**
     * @public
     * @override
     */
    reset: function() {

      // universal operation control has Properties and animations that may be in progress
      this.universalOperationControl.reset();

      VariablesSceneNode.prototype.reset.call( this );
    }
  } );
} );