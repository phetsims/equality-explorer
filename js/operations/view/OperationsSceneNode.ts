// Copyright 2017-2023, University of Colorado Boulder

/**
 * View of a scene in the 'Operations' screen.
 * Like the scene in the 'Variables' screen, but with an added control for applying a universal operation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Node } from '../../../../scenery/js/imports.js';
import SumToZeroNode from '../../common/view/SumToZeroNode.js';
import UniversalOperationControl from '../../common/view/UniversalOperationControl.js';
import equalityExplorer from '../../equalityExplorer.js';
import VariablesSceneNode, { VariablesSceneNodeOptions } from '../../variables/view/VariablesSceneNode.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import OperationsScene from '../model/OperationsScene.js';

type SelfOptions = EmptySelfOptions;

export type OperationsSceneNodeOptions = SelfOptions & VariablesSceneNodeOptions;

export default class OperationsSceneNode extends VariablesSceneNode {

  // Universal Operation control, below Equation accordion box
  private readonly universalOperationControl: UniversalOperationControl;

  public constructor( scene: OperationsScene,
                      equationAccordionBoxExpandedProperty: Property<boolean>,
                      snapshotsAccordionBoxExpandedProperty: Property<boolean>,
                      layoutBounds: Bounds2,
                      providedOptions: OperationsSceneNodeOptions ) {

    const options = optionize<OperationsSceneNodeOptions, SelfOptions, VariablesSceneNodeOptions>()( {

      // VariablesSceneNodeOptions
      organizeButtonVisible: false // like terms are combines, so the organize button is not relevant in this screen
    }, providedOptions );

    super( scene, equationAccordionBoxExpandedProperty, snapshotsAccordionBoxExpandedProperty, layoutBounds, options );

    // Layer when universal operation animation occurs
    const operationAnimationLayer = new Node();

    this.universalOperationControl = new UniversalOperationControl( scene, operationAnimationLayer, {
      tandem: options.tandem.createTandem( 'universalOperationControl' )
    } );
    this.addChild( this.universalOperationControl );
    this.universalOperationControl.moveToBack();

    this.universalOperationControl.boundsProperty.link( bounds => {
      this.universalOperationControl.centerX = scene.scale.position.x; // centered on the scale
      this.universalOperationControl.top = this.equationAccordionBox.bottom + 10;
    } );

    // Put animation layer on top of everything
    this.addChild( operationAnimationLayer );

    // Perform sum-to-zero animation for any terms that became zero as the result of a universal operation.
    scene.sumToZeroEmitter.addListener( termCreators => SumToZeroNode.animateSumToZero( termCreators, this.termsLayer ) );
  }

  /**
   * @param dt - time step, in seconds
   */
  public override step( dt: number ): void {
    this.universalOperationControl.step( dt );
    super.step( dt );
  }

  public override reset(): void {

    // universal operation control has Properties and animations that may be in progress
    this.universalOperationControl.reset();

    super.reset();
  }
}

equalityExplorer.register( 'OperationsSceneNode', OperationsSceneNode );