// Copyright 2017-2019, University of Colorado Boulder

/**
 * View of a scene in the 'Operations' screen.
 * Like the scene in the 'Variables' screen, but with an added control for applying a universal operation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const UniversalOperationControl = require( 'EQUALITY_EXPLORER/common/view/UniversalOperationControl' );
  const VariablesSceneNode = require( 'EQUALITY_EXPLORER/variables/view/VariablesSceneNode' );

  /**
   * @param {EqualityExplorerScene} scene
   * @param {Property.<EqualityExplorerScene>} sceneProperty - the selected scene
   * @param {BooleanProperty} equationAccordionBoxExpandedProperty
   * @param {BooleanProperty} snapshotsAccordionBoxExpandedProperty
   * @param {Bounds2} layoutBounds
   * @param {Object} [options]
   * @constructor
   */
  function OperationsSceneNode( scene, sceneProperty, equationAccordionBoxExpandedProperty,
                                snapshotsAccordionBoxExpandedProperty, layoutBounds, options ) {

    options = merge( {

      // VariablesSceneNode options
      organizeButtonVisible: false // like terms are combines, so the organize button is not relevant in this screen
    }, options );

    VariablesSceneNode.call( this, scene, sceneProperty, equationAccordionBoxExpandedProperty,
      snapshotsAccordionBoxExpandedProperty, layoutBounds, options );

    // Layer when universal operation animation occurs
    const operationAnimationLayer = new Node();

    // @private Universal Operation, below Equation accordion box
    this.universalOperationControl = new UniversalOperationControl( scene, operationAnimationLayer, {
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
     * @param {number} dt - time step, in seconds
     * @public
     */
    step: function( dt ) {
      this.universalOperationControl.step( dt );
    },

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