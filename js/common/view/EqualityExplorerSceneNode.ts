// Copyright 2017-2023, University of Colorado Boulder

/**
 * EqualityExplorerSceneNode is the base class for displaying scenes in Equality Explorer.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Disposable from '../../../../axon/js/Disposable.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Node, NodeOptions, PressListenerEvent } from '../../../../scenery/js/imports.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerScene from '../model/EqualityExplorerScene.js';
import TermCreator from '../model/TermCreator.js';
import Term from '../model/Term.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import OopsDialog from '../../../../scenery-phet/js/OopsDialog.js';
import EqualityExplorerStrings from '../../EqualityExplorerStrings.js';
import Tandem from '../../../../tandem/js/Tandem.js';

const dialogsTandem = Tandem.GLOBAL_VIEW.createTandem( 'dialogs' );

type SelfOptions = EmptySelfOptions;

export type EqualityExplorerSceneNodeOptions = SelfOptions &
  PickOptional<NodeOptions, 'children' | 'visibleProperty' | 'phetioVisiblePropertyInstrumented'> &
  PickRequired<NodeOptions, 'tandem'>;

export default class EqualityExplorerSceneNode extends Node {

  public readonly scene: EqualityExplorerScene;
  public readonly snapshotsAccordionBox: Node; // for layout
  protected readonly termsLayer: Node; // terms live in this layer

  // This dialog displays a message when an operation or interaction would result in EqualityExplorer.maxInteger
  // being exceeded. Instantiation of this dialog must be deferred because phet.joist.sim must exist before any dialog
  // can be created. We are re-using a single instance of this dialog because it is modal, and to avoid using PhetioCapsule.
  // See https://github.com/phetsims/equality-explorer/issues/196.
  // To test this dialog:
  // 1. Run the sim with ?maxInteger=1
  // 2. Go to the Operations screen
  // 3. Press the yellow 'go' (arrow) button twice
  // 4. The dialog is displayed.
  private static numberTooBigDialog: OopsDialog;

  // These dialogs display a message when an inverse term cannot be created because the opposite plate is full.
  // The dialog must be instantiated on demand because phet.joist.sim must exist before any dialog can be created.
  // We are re-using a single instance of this dialog because it is modal, and to avoid using PhetioCapsule.
  // See https://github.com/phetsims/equality-explorer/issues/196
  // To test these dialogs:
  // 1. Run the sim with ?rows=1&columns=1&showGrid
  // 1. Go to the Numbers or Variables screen
  // 2. Put a '1' on a plate.
  // 3. Put a '-1' on the opposite plate.
  // 4. Turn the lock on.
  // 5. Attempt to drag the '1' off the plate.
  // 6. The drag is cancelled, and a dialog is displayed indicating "Left side of the balance is full" or
  //    "Right side of the balance is full", depending on which plate is full.
  public static leftSideFullDialog: OopsDialog;
  public static rightSideFullDialog: OopsDialog;

  protected constructor( scene: EqualityExplorerScene,
                         snapshotsAccordionBox: Node,
                         termsLayer: Node,
                         providedOptions: EqualityExplorerSceneNodeOptions ) {

    super( providedOptions );

    this.scene = scene;
    this.snapshotsAccordionBox = snapshotsAccordionBox;
    this.termsLayer = termsLayer;

    if ( !EqualityExplorerSceneNode.numberTooBigDialog ) {
      EqualityExplorerSceneNode.numberTooBigDialog = new OopsDialog( EqualityExplorerStrings.numberTooBigStringProperty, {
        focusOnHideNode: null,
        tandem: dialogsTandem.createTandem( 'numberTooBigDialog' ),
        phetioDocumentation: 'Displayed when an interaction or operation would result in a number that is too big for the sim'
      } );
    }

    if ( !EqualityExplorerSceneNode.leftSideFullDialog ) {
      EqualityExplorerSceneNode.leftSideFullDialog = new OopsDialog( EqualityExplorerStrings.leftSideFullStringProperty, {
        focusOnHideNode: null,
        tandem: dialogsTandem.createTandem( 'leftSideFullDialog' ),
        phetioDocumentation: 'Displayed when an inverse term cannot be created because the left side of the balance scale is full'
      } );
    }

    if ( !EqualityExplorerSceneNode.rightSideFullDialog ) {
      EqualityExplorerSceneNode.rightSideFullDialog = new OopsDialog( EqualityExplorerStrings.rightSideFullStringProperty, {
        focusOnHideNode: null,
        tandem: dialogsTandem.createTandem( 'rightSideFullDialog' ),
        phetioDocumentation: 'Displayed when an inverse term cannot be created because the right side of the balance scale is full'
      } );
    }

    /**
     * When a term is created in the model, create the corresponding view.
     * Event is non-null when the term was created via a user interaction.
     */
    const termCreatedListener = ( termCreator: TermCreator, term: Term, event: PressListenerEvent | null ) => {

      // create a TermNode
      const termNode = termCreator.createTermNode( term ); //TODO https://github.com/phetsims/equality-explorer/issues/200 dynamic
      termsLayer.addChild( termNode );

      // Clean up when the term is disposed. Term.dispose handles removal of this listener.
      term.disposedEmitter.addListener( term => termNode.dispose() );

      // start a drag cycle by forwarding the event to termNode.
      if ( event ) {
        termNode.startDrag( event );
      }
    };

    // When the maxInteger limit is exceeded, dispose of all terms that are not on the scale, and display a dialog.
    // To test this, see doc for EqualityExplorerSceneNode.numberTooBigDialog.
    const maxIntegerExceededListener = () => {
      phet.log && phet.log( 'maxInteger exceeded' );
      scene.disposeTermsNotOnScale();
      EqualityExplorerSceneNode.numberTooBigDialog.show();
    };

    scene.allTermCreators.forEach( termCreator => {
      termCreator.termCreatedEmitter.addListener( termCreatedListener );
      termCreator.maxIntegerExceededEmitter.addListener( maxIntegerExceededListener );
    } );
  }

  public override dispose(): void {
    Disposable.assertNotDisposable();
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