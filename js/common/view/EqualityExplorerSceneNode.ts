// Copyright 2017-2022, University of Colorado Boulder

/**
 * Base class for displaying scenes in Equality Explorer.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import OopsDialog from '../../../../scenery-phet/js/OopsDialog.js';
import { Node, NodeOptions, SceneryEvent } from '../../../../scenery/js/imports.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerStrings from '../../EqualityExplorerStrings.js';
import EqualityExplorerConstants from '../EqualityExplorerConstants.js';
import EqualityExplorerScene from '../model/EqualityExplorerScene.js';
import SumToZeroNode from './SumToZeroNode.js';
import TermCreator from '../model/TermCreator.js';
import Term from '../model/Term.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';

type SelfOptions = EmptySelfOptions;

export type EqualityExplorerSceneNodeOptions = SelfOptions & PickOptional<NodeOptions, 'children'>;

export default class EqualityExplorerSceneNode extends Node {

  public readonly scene: EqualityExplorerScene;
  protected readonly termsLayer: Node; // terms live in this layer

  protected constructor( scene: EqualityExplorerScene,
                         sceneProperty: Property<EqualityExplorerScene>,
                         termsLayer: Node,
                         providedOptions?: EqualityExplorerSceneNodeOptions ) {

    const options = optionize<EqualityExplorerSceneNodeOptions, SelfOptions, NodeOptions>()( {
      // empty optionize call because we're calling this.mutate below.
    }, providedOptions );

    super();

    this.scene = scene;
    this.termsLayer = termsLayer;

    /**
     * When a term is created in the model, create the corresponding view.
     * Event is non-null when the term was created via a user interaction.
     */
    const termCreatedListener = ( termCreator: TermCreator, term: Term, event: SceneryEvent | null ) => {

      // create a TermNode
      const termNode = termCreator.createTermNode( term );
      termsLayer.addChild( termNode );

      // Clean up when the term is disposed. Term.dispose handles removal of this listener.
      term.disposedEmitter.addListener( term => termNode.dispose() );

      // start a drag cycle by forwarding the event to termNode.
      if ( event ) {
        termNode.startDrag( event );
      }
    };

    // When the maxInteger limit is exceeded, dispose of all terms that are not on the scale, and display a dialog.
    let dialog: OopsDialog;
    const maxIntegerExceededListener = () => {
      phet.log && phet.log( 'maxInteger exceeded' );
      scene.disposeTermsNotOnScale();
      dialog = dialog || new OopsDialog( EqualityExplorerStrings.numberTooBigStringProperty );
      dialog.show();
    };

    scene.allTermCreators.forEach( termCreator => {
      // @ts-ignore TODO https://github.com/phetsims/equality-explorer/issues/186 remove when TermCreator as been converted to TS
      termCreator.termCreatedEmitter.addListener( termCreatedListener );
      termCreator.maxIntegerExceededEmitter.addListener( maxIntegerExceededListener );
    } );

    this.mutate( options );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Performs sum-to-zero animation for terms that have summed to zero.
   * Intended to be used in screens where like terms are combined in one cell on the scale,
   * and that involve applying universal operations.  Because universal operations may result
   * in more than one term summing to zero, we need to perform sum-to-zero animations after
   * the operation has been applied to all terms, so that the scale is in its final position.
   * @param termCreators - term creators whose term summed to zero
   */
  public animateSumToZero( termCreators: TermCreator[] ): void {

    for ( let i = 0; i < termCreators.length; i++ ) {

      const termCreator = termCreators[ i ];

      assert && assert( termCreator.combineLikeTermsEnabled,
        'animateSumToZero should only be used when combineLikeTermsEnabled' );

      // determine where the cell that contained the term is currently located
      const cellCenter = termCreator.plate.getPositionOfCell( termCreator.likeTermsCell );

      // display the animation in that cell
      const sumToZeroNode = new SumToZeroNode( {
        // @ts-ignore TODO https://github.com/phetsims/equality-explorer/issues/186 not all TermCreator subclasses have variable property
        variable: termCreator.variable || null,
        fontSize: EqualityExplorerConstants.SUM_TO_ZERO_BIG_FONT_SIZE,
        center: cellCenter
      } );
      this.termsLayer.addChild( sumToZeroNode );
      sumToZeroNode.startAnimation();
    }
  }
}

equalityExplorer.register( 'EqualityExplorerSceneNode', EqualityExplorerSceneNode );