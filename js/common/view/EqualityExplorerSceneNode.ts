// Copyright 2017-2022, University of Colorado Boulder

/**
 * Base class for displaying scenes in Equality Explorer.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import OopsDialog from '../../../../scenery-phet/js/OopsDialog.js';
import { Node, NodeOptions, PressListenerEvent } from '../../../../scenery/js/imports.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerStrings from '../../EqualityExplorerStrings.js';
import EqualityExplorerScene from '../model/EqualityExplorerScene.js';
import TermCreator from '../model/TermCreator.js';
import Term from '../model/Term.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioCapsule from '../../../../tandem/js/PhetioCapsule.js';

type SelfOptions = EmptySelfOptions;

export type EqualityExplorerSceneNodeOptions = SelfOptions &
  PickOptional<NodeOptions, 'children' | 'visibleProperty' | 'phetioVisiblePropertyInstrumented'> &
  PickRequired<NodeOptions, 'tandem'>;

export default class EqualityExplorerSceneNode extends Node {

  public readonly scene: EqualityExplorerScene;
  public readonly snapshotsAccordionBox: Node; // for layout
  protected readonly termsLayer: Node; // terms live in this layer

  protected constructor( scene: EqualityExplorerScene,
                         snapshotsAccordionBox: Node,
                         termsLayer: Node,
                         providedOptions: EqualityExplorerSceneNodeOptions ) {

    super( providedOptions );

    this.scene = scene;
    this.snapshotsAccordionBox = snapshotsAccordionBox;
    this.termsLayer = termsLayer;

    /**
     * When a term is created in the model, create the corresponding view.
     * Event is non-null when the term was created via a user interaction.
     */
    const termCreatedListener = ( termCreator: TermCreator, term: Term, event: PressListenerEvent | null ) => {

      // create a TermNode
      const termNode = termCreator.createTermNode( term ); //TODO dynamic
      termsLayer.addChild( termNode );

      // Clean up when the term is disposed. Term.dispose handles removal of this listener.
      term.disposedEmitter.addListener( term => termNode.dispose() );

      // start a drag cycle by forwarding the event to termNode.
      if ( event ) {
        termNode.startDrag( event );
      }
    };

    // To manage dynamic instrumented OopsDialog
    //TODO replace oopsDialogCapsule with one static OopsDialog that is used by all scenes
    const oopsDialogCapsule = new PhetioCapsule( tandem => new OopsDialog( EqualityExplorerStrings.numberTooBigStringProperty, {
      //TODO focusOnHideNode:
      tandem: tandem
    } ), [], {
      tandem: providedOptions.tandem.createTandem( 'oopsDialogCapsule' ),
      phetioType: PhetioCapsule.PhetioCapsuleIO( OopsDialog.OopsDialogIO )
    } );

    // When the maxInteger limit is exceeded, dispose of all terms that are not on the scale, and display a dialog.
    // To test this, see EqualityExplorerQueryParameters.maxInteger.
    const maxIntegerExceededListener = () => {
      phet.log && phet.log( 'maxInteger exceeded' );
      scene.disposeTermsNotOnScale();
      oopsDialogCapsule.getElement().show();
    };

    scene.allTermCreators.forEach( termCreator => {
      termCreator.termCreatedEmitter.addListener( termCreatedListener );
      termCreator.maxIntegerExceededEmitter.addListener( maxIntegerExceededListener );
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public step( dt: number ): void {
    // the default behavior is to do nothing
  }

  public reset(): void {
    // the default behavior is to do nothing
  }
}


equalityExplorer.register( 'EqualityExplorerSceneNode', EqualityExplorerSceneNode );