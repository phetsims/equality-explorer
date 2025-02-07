// Copyright 2017-2024, University of Colorado Boulder

/**
 * Abstract base type for ScreenViews in the Equality Explorer sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerConstants from '../EqualityExplorerConstants.js';
import EqualityExplorerModel from '../model/EqualityExplorerModel.js';
import EqualityExplorerScene from '../model/EqualityExplorerScene.js';
import EqualityExplorerSceneNode, { EqualityExplorerSceneNodeOptions } from './EqualityExplorerSceneNode.js';
import SceneRadioButtonGroup from './SceneRadioButtonGroup.js';

type SelfOptions = EmptySelfOptions;

export type EqualityExplorerScreenViewOptions = SelfOptions & StrictOmit<ScreenViewOptions, 'tandem'>;

export default abstract class EqualityExplorerScreenView extends ScreenView {

  // Each ScreenView has its own state for accordion boxes,
  // see https://github.com/phetsims/equality-explorer/issues/124
  private readonly equationAccordionBoxExpandedProperty: Property<boolean>;
  private readonly snapshotsAccordionBoxExpandedProperty: Property<boolean>;

  // a Node for each scene
  private readonly sceneNodes: EqualityExplorerSceneNode[];

  protected constructor( model: EqualityExplorerModel, tandem: Tandem, providedOptions?: EqualityExplorerScreenViewOptions ) {

    const options = optionize<EqualityExplorerScreenViewOptions, SelfOptions, ScreenViewOptions>()( {

      // ScreenViewOptions
      isDisposable: false,
      layoutBounds: EqualityExplorerConstants.SCREEN_VIEW_LAYOUT_BOUNDS,
      preventFit: EqualityExplorerConstants.SCREEN_VIEW_PREVENT_FIT,
      tandem: tandem
    }, providedOptions );

    super( options );

    const screenViewChildren: Node[] = [];

    this.equationAccordionBoxExpandedProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'equationAccordionBoxExpandedProperty' ),
      phetioDocumentation: 'Applies to the "Equation or Inequality" accordion box for all scenes'
    } );

    this.snapshotsAccordionBoxExpandedProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'snapshotsAccordionBoxExpandedProperty' ),
      phetioDocumentation: 'Applies to the "Snapshots" accordion box for all scenes'
    } );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        phet.log && phet.log( 'ResetAllButton pressed' );
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - EqualityExplorerConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );
    screenViewChildren.push( resetAllButton );

    // If there is more than 1 scene, organize them under a 'sceneNodes' tandem.
    const sceneNodesTandem = ( model.scenes.length === 1 ) ? options.tandem : options.tandem.createTandem( 'sceneNodes' );

    // Create a Node for each scene.
    this.sceneNodes = [];
    model.scenes.forEach( scene => {
      const sceneNodeTandem = sceneNodesTandem.createTandem( `${scene.tandem.name}Node` );
      const sceneNode = this.createSceneNode( scene,
        this.equationAccordionBoxExpandedProperty,
        this.snapshotsAccordionBoxExpandedProperty,
        this.layoutBounds, {
          visibleProperty: new DerivedProperty(
            [ model.sceneProperty ],
            selectedScene => scene === selectedScene, {
              tandem: sceneNodeTandem.createTandem( 'visibleProperty' ),
              phetioValueType: BooleanIO
            } ),
          tandem: sceneNodeTandem
        } );
      this.sceneNodes.push( sceneNode );
      screenViewChildren.push( sceneNode );
    } );

    // If there is more than 1 scene, create radio buttons for selecting a scene.
    if ( model.scenes.length > 1 ) {

      const sceneRadioButtonGroup = new SceneRadioButtonGroup( model.scenes, model.sceneProperty, {
        tandem: options.tandem.createTandem( 'sceneRadioButtonGroup' )
      } );
      screenViewChildren.push( sceneRadioButtonGroup );

      // Centered under Snapshots accordion box
      const snapshotsAccordionBox = this.sceneNodes[ 0 ].snapshotsAccordionBox;
      sceneRadioButtonGroup.boundsProperty.link( bounds => {
        sceneRadioButtonGroup.centerX = snapshotsAccordionBox.centerX;
        sceneRadioButtonGroup.centerY = snapshotsAccordionBox.bottom + ( resetAllButton.top - snapshotsAccordionBox.bottom ) / 2;
      } );
    }

    const screenViewRootNode = new Node( {
      children: screenViewChildren
    } );
    this.addChild( screenViewRootNode );
  }

  public reset(): void {
    this.equationAccordionBoxExpandedProperty.reset();
    this.snapshotsAccordionBoxExpandedProperty.reset();
    this.sceneNodes.forEach( sceneNode => sceneNode.reset() );
  }

  /**
   * Animates the view.
   * @param dt - elapsed time, in seconds
   */
  public override step( dt: number ): void {

    super.step( dt );

    // animate the view for the selected scene
    for ( let i = 0; i < this.sceneNodes.length; i++ ) {
      const sceneNode = this.sceneNodes[ i ];
      if ( sceneNode.visible ) {
        sceneNode.step( dt );
        break;
      }
    }
  }

  /**
   * Creates the Node for this scene.
   */
  protected abstract createSceneNode( scene: EqualityExplorerScene,
                                      equationAccordionBoxExpandedProperty: Property<boolean>,
                                      snapshotsAccordionBoxExpandedProperty: Property<boolean>,
                                      layoutBounds: Bounds2,
                                      providedOptions: EqualityExplorerSceneNodeOptions ): EqualityExplorerSceneNode;
}

equalityExplorer.register( 'EqualityExplorerScreenView', EqualityExplorerScreenView );