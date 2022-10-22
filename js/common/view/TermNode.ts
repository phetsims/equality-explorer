// Copyright 2018-2022, University of Colorado Boulder

/**
 * TermNode is the base class for displaying a term.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { Circle, Node, NodeOptions, PressListenerEvent } from '../../../../scenery/js/imports.js';
import equalityExplorer from '../../equalityExplorer.js';
import Term from '../model/Term.js';
import TermCreator from '../model/TermCreator.js';
import CombineTermsDragListener from './CombineTermsDragListener.js';
import HaloNode from './HaloNode.js';
import SeparateTermsDragListener from './SeparateTermsDragListener.js';
import TermDragListener from './TermDragListener.js';

// constants
const DEFAULT_SHADOW_OFFSET = new Dimension2( 4, 4 );

type SelfOptions = {
  shadowOffset?: Dimension2;
};

export type TermNodeOptions = SelfOptions;

export default class TermNode extends Node {

  public readonly term: Term;
  public readonly contentNodeSize: Dimension2;

  private readonly termDragListener: TermDragListener;
  private readonly disposeTermNode: () => void;

  protected constructor( termCreator: TermCreator, term: Term, contentNode: Node, shadowNode: Node, providedOptions?: TermNodeOptions ) {

    const options = optionize<TermNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      shadowOffset: DEFAULT_SHADOW_OFFSET,

      // NodeOptions
      cursor: 'pointer'
    }, providedOptions );

    contentNode.centerX = 0;
    contentNode.centerY = 0;
    shadowNode.right = contentNode.right + options.shadowOffset.width;
    shadowNode.bottom = contentNode.bottom + options.shadowOffset.height;

    // halo around the content
    const haloRadius = Math.max( contentNode.width, contentNode.height );
    const haloNode = new HaloNode( haloRadius, {
      center: contentNode.center,
      visible: false
    } );

    assert && assert( !options.children, 'TermNode sets children' );
    options.children = [ haloNode, shadowNode, contentNode ];

    // Red dot at the origin
    if ( phet.chipper.queryParameters.dev ) {
      options.children.push( new Circle( 2, { fill: 'red' } ) );
    }

    super( options );

    this.term = term;
    this.contentNodeSize = new Dimension2( contentNode.width, contentNode.height );

    // Move to position
    const positionObserver = ( position: Vector2 ) => {
      this.center = position;
    };
    term.positionProperty.link( positionObserver ); // unlink required in dispose

    // Pickable (interactivity)
    const pickableListener = ( pickable: boolean ) => {
      this.pickable = pickable;
    };
    term.pickableProperty.link( pickableListener ); // unlink required in dispose

    // Whether the term is on a plate determines its rendering order
    const onPlateListener = ( onPlate: boolean ) => {
      if ( onPlate ) {
        this.moveToBack();
      }
      else {
        this.moveToFront();
      }
    };
    term.onPlateProperty.link( onPlateListener ); // unlink required in dispose

    // Show/hide shadow
    const shadowVisibleListener = ( shadowVisible: boolean ) => {
      shadowNode.visible = shadowVisible;
    };
    term.shadowVisibleProperty.link( shadowVisibleListener ); // unlink required in dispose

    // Show/hide halo
    const haloVisibleListener = ( haloVisible: boolean ) => {
      haloNode.visible = haloVisible;
    };
    term.haloVisibleProperty.link( haloVisibleListener ); // unlink required in dispose

    const dragListenerOptions = {
      haloRadius: haloRadius
    };

    if ( termCreator.combineLikeTermsEnabled ) {
      // dispose required
      this.termDragListener = new CombineTermsDragListener( this, term, termCreator, dragListenerOptions );
    }
    else {
      // dispose required
      this.termDragListener = new SeparateTermsDragListener( this, term, termCreator, dragListenerOptions );
    }
    this.addInputListener( this.termDragListener ); // removeListener required in dispose

    this.disposeTermNode = () => {

      if ( term.positionProperty.hasListener( positionObserver ) ) {
        term.positionProperty.unlink( positionObserver );
      }

      if ( term.pickableProperty.hasListener( pickableListener ) ) {
        term.pickableProperty.unlink( pickableListener );
      }

      if ( term.onPlateProperty.hasListener( onPlateListener ) ) {
        term.onPlateProperty.unlink( onPlateListener );
      }

      if ( term.shadowVisibleProperty.hasListener( shadowVisibleListener ) ) {
        term.haloVisibleProperty.unlink( shadowVisibleListener );
      }

      if ( term.shadowVisibleProperty.hasListener( haloVisibleListener ) ) {
        term.haloVisibleProperty.unlink( haloVisibleListener );
      }

      this.removeInputListener( this.termDragListener );
      this.termDragListener.dispose();
    };
  }

  public override dispose(): void {
    this.disposeTermNode();
    super.dispose();
  }

  /**
   * Starts a drag cycle.
   * The user drags a new term out of a toolbox below the scale by clicking on a TermCreatorNode.
   * That action causes TermCreatorNode to instantiate a TermNode.  This function allows
   * TermCreatorNode to forward the startDrag event to the TermNode that it created.
   */
  public startDrag( event: PressListenerEvent ): void {
    this.termDragListener.press( event );
  }
}

equalityExplorer.register( 'TermNode', TermNode );