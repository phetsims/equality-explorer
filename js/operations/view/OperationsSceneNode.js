// Copyright 2017-2021, University of Colorado Boulder

/**
 * View of a scene in the 'Operations' screen.
 * Like the scene in the 'Variables' screen, but with an added control for applying a universal operation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import { Node } from '../../../../scenery/js/imports.js';
import UniversalOperationControl from '../../common/view/UniversalOperationControl.js';
import equalityExplorer from '../../equalityExplorer.js';
import VariablesSceneNode from '../../variables/view/VariablesSceneNode.js';

class OperationsSceneNode extends VariablesSceneNode {

  /**
   * @param {EqualityExplorerScene} scene
   * @param {Property.<EqualityExplorerScene>} sceneProperty - the selected scene
   * @param {BooleanProperty} equationAccordionBoxExpandedProperty
   * @param {BooleanProperty} snapshotsAccordionBoxExpandedProperty
   * @param {Bounds2} layoutBounds
   * @param {Object} [options]
   */
  constructor( scene, sceneProperty, equationAccordionBoxExpandedProperty,
               snapshotsAccordionBoxExpandedProperty, layoutBounds, options ) {

    options = merge( {

      // VariablesSceneNode options
      organizeButtonVisible: false // like terms are combines, so the organize button is not relevant in this screen
    }, options );

    super( scene, sceneProperty, equationAccordionBoxExpandedProperty,
      snapshotsAccordionBoxExpandedProperty, layoutBounds, options );

    // Layer when universal operation animation occurs
    const operationAnimationLayer = new Node();

    // @private Universal Operation, below Equation accordion box
    this.universalOperationControl = new UniversalOperationControl( scene, operationAnimationLayer, {
      centerX: scene.scale.position.x, // centered on the scale
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

  /**
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt ) {
    this.universalOperationControl.step( dt );
  }

  /**
   * @public
   * @override
   */
  reset() {

    // universal operation control has Properties and animations that may be in progress
    this.universalOperationControl.reset();

    super.reset();
  }
}

equalityExplorer.register( 'OperationsSceneNode', OperationsSceneNode );

export default OperationsSceneNode;