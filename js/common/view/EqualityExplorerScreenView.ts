// Copyright 2017-2022, University of Colorado Boulder

/**
 * Abstract base type for ScreenViews in the Equality Explorer sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerConstants from '../EqualityExplorerConstants.js';
import EqualityExplorerModel from '../model/EqualityExplorerModel.js';
import SceneRadioButtonGroup from './SceneRadioButtonGroup.js';
import EqualityExplorerScene from '../model/EqualityExplorerScene.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import EqualityExplorerSceneNode, { EqualityExplorerSceneNodeOptions } from './EqualityExplorerSceneNode.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';

type SelfOptions = {

  // true = positive and negative terms in the toolbox, e.g. x, -x, 1, -1
  // false = only positive terms in the toolbox, e.g. x, 1
  hasNegativeTermsInToolbox?: boolean;
};

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

      // SelfOptions
      hasNegativeTermsInToolbox: true,

      // ScreenViewOptions
      layoutBounds: EqualityExplorerConstants.SCREEN_VIEW_LAYOUT_BOUNDS,
      preventFit: EqualityExplorerConstants.SCREEN_VIEW_PREVENT_FIT,
      tandem: tandem
    }, providedOptions );

    super( options );

    this.equationAccordionBoxExpandedProperty =
      new BooleanProperty( EqualityExplorerConstants.EQUATION_ACCORDION_BOX_EXPANDED );

    this.snapshotsAccordionBoxExpandedProperty =
      new BooleanProperty( EqualityExplorerConstants.SNAPSHOTS_ACCORDION_BOX_EXPANDED );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        phet.log && phet.log( 'ResetAllButton pressed' );
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - EqualityExplorerConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - EqualityExplorerConstants.SCREEN_VIEW_Y_MARGIN
    } );
    this.addChild( resetAllButton );

    this.sceneNodes = [];
    model.scenes.forEach( scene => {
      const sceneNode = this.createSceneNode( scene,
        this.equationAccordionBoxExpandedProperty,
        this.snapshotsAccordionBoxExpandedProperty,
        this.layoutBounds, {
          // @ts-ignore TODO https://github.com/phetsims/equality-explorer/issues/186 BasicsSceneNodeOptions.hasNegativeTermsInToolbox
          hasNegativeTermsInToolbox: options.hasNegativeTermsInToolbox
        } );
      this.sceneNodes.push( sceneNode );
      this.addChild( sceneNode );
    } );

    // If the model has more than 1 scene, create a control for scene selection.
    if ( model.scenes.length > 1 ) {

      // Get the bounds of the Snapshot accordion box, relative to this ScreenView
      const snapshotsAccordionBox = this.sceneNodes[ 0 ].snapshotsAccordionBox;

      // Center the scene radio button group in the space below the Snapshots accordion box
      const sceneRadioButtonGroup = new SceneRadioButtonGroup( model.scenes, model.sceneProperty, {
        centerX: snapshotsAccordionBox.centerX,
        centerY: snapshotsAccordionBox.bottom + ( resetAllButton.top - snapshotsAccordionBox.bottom ) / 2
      } );
      this.addChild( sceneRadioButtonGroup );
    }

    // Make the selected scene visible. unlink not needed.
    model.sceneProperty.link( scene => {
      for ( let i = 0; i < this.sceneNodes.length; i++ ) {
        this.sceneNodes[ i ].visible = ( this.sceneNodes[ i ].scene === scene );
      }
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
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
                                      providedOptions?: EqualityExplorerSceneNodeOptions ): EqualityExplorerSceneNode;
}

equalityExplorer.register( 'EqualityExplorerScreenView', EqualityExplorerScreenView );