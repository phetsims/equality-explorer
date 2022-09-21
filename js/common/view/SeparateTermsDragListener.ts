// Copyright 2018-2022, University of Colorado Boulder

/**
 * Drag listener used when like terms occupy separate cells on a plate.
 * Like terms are combined only if they sum to zero.
 * See terminology and requirements in TermDragListener superclass.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import OopsDialog from '../../../../scenery-phet/js/OopsDialog.js';
import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerStrings from '../../EqualityExplorerStrings.js';
import Term from '../model/Term.js';
import TermCreator from '../model/TermCreator.js';
import TermDragListener, { TermDragListenerOptions } from './TermDragListener.js';
import TermNode from './TermNode.js';
import SumToZeroNode from './SumToZeroNode.js';

type SelfOptions = EmptySelfOptions;

type SeparateTermsDragListenerOptions = SelfOptions & TermDragListenerOptions;

export default class SeparateTermsDragListener extends TermDragListener {

  // inverse term on opposite plate, for lock feature
  private inverseTerm: Term | null;

  // If the inverse term is dragged, break the association between equivalentTerm and inverseTerm
  private readonly inverseTermDraggingListener: ( dragging: boolean ) => void;

  private readonly disposeSeparateTermsDragListener: () => void;

  /**
   * @param termNode - Node that the listener is attached to
   * @param term - the term being dragged
   * @param termCreator - the creator of term
   * @param [providedOptions]
   */
  public constructor( termNode: TermNode, term: Term, termCreator: TermCreator, providedOptions?: SeparateTermsDragListenerOptions ) {
    assert && assert( !termCreator.combineLikeTermsEnabled,
      'SeparateTermsDragListener is used when like terms occupy separate cells' );

    super( termNode, term, termCreator, providedOptions );

    this.inverseTerm = null;

    this.inverseTermDraggingListener = dragging => {
      const inverseTerm = this.inverseTerm!;
      assert && assert( inverseTerm, 'there is no associated inverse term' );
      if ( dragging ) {
        if ( inverseTerm.draggingProperty.hasListener( this.inverseTermDraggingListener ) ) {
          inverseTerm.draggingProperty.unlink( this.inverseTermDraggingListener );
        }
        this.inverseTerm = null;
      }
    };

    this.disposeSeparateTermsDragListener = () => {
      if ( this.inverseTerm && this.inverseTerm.draggingProperty.hasListener( this.inverseTermDraggingListener ) ) {
        this.inverseTerm.draggingProperty.unlink( this.inverseTermDraggingListener );
      }
    };
  }

  public override dispose(): void {
    this.disposeSeparateTermsDragListener();
    super.dispose();
  }

  //-------------------------------------------------------------------------------------------------
  // Below here is the implementation of the TermDragListener API
  //-------------------------------------------------------------------------------------------------

  /**
   * Called at the start of a drag cycle, when lock is on, to handle related terms on the opposite side.
   * @returns true=success, false=failure
   */
  protected override startOpposite(): boolean {
    assert && assert( this.termCreator.lockedProperty.value, 'startOpposite should only be called when lock is on' );

    const termCell = this.plate.getCellForTerm( this.term )!;
    assert && assert( termCell );
    this.equivalentTerm = this.oppositePlate.getClosestEquivalentTerm( this.term, termCell );

    if ( this.equivalentTerm ) {

      // found equivalent term on opposite plate, remove it from plate
      this.equivalentTermCreator.removeTermFromPlate( this.equivalentTerm );
    }
    else if ( this.oppositePlate.isFull() ) {

      // opposite plate is full, cannot create inverse term, show 'Oops' message
      const thisIsLeft = ( this.termCreator.positivePosition.x < this.equivalentTermCreator.positivePosition.x );
      const messageStringProperty = thisIsLeft ?
                      EqualityExplorerStrings.rightSideFullStringProperty :
                      EqualityExplorerStrings.leftSideFullStringProperty;
      const oopsDialog = new OopsDialog( messageStringProperty );
      oopsDialog.show();

      // interrupt this drag sequence, since we can't take term off the plate
      this.interrupt();
      return false;
    }
    else {

      // no equivalent term on opposite plate, create an inverse term
      this.inverseTerm = this.equivalentTermCreator.createTerm( merge( this.term.copyOptions(), {
        sign: -1
      } ) );
      const inverseTermPosition = this.termCreator.getEquivalentTermPosition( this.term );
      const inverseCell = this.oppositePlate.getBestEmptyCell( inverseTermPosition )!;
      assert && assert( inverseCell );
      this.equivalentTermCreator.putTermOnPlate( this.inverseTerm, inverseCell );

      // if the inverse term is dragged, break the association to equivalentTerm
      this.inverseTerm.draggingProperty.lazyLink( this.inverseTermDraggingListener ); // unlink needed in dispose

      // create the equivalent term on the opposite side
      // Do this after creating inverseTerm so that it appear in front of inverseTerm.
      this.equivalentTerm = this.equivalentTermCreator.createTerm( this.term.copyOptions() );
    }

    return true;
  }

  /**
   * Called at the end of a drag cycle, when lock is on, to handle related terms on the opposite side.
   * @returns non-null if the drag results in terms on the opposite plate summing to zero
   */
  protected override endOpposite(): SumToZeroNode | null {
    assert && assert( this.termCreator.lockedProperty.value, 'endOpposite should only be called when lock is on' );

    const equivalentTerm = this.equivalentTerm!;
    assert && assert( equivalentTerm );

    // put equivalent term in an empty cell
    const emptyCell = this.oppositePlate.getBestEmptyCell( equivalentTerm.positionProperty.value )!;
    assert && assert( emptyCell );
    this.equivalentTermCreator.putTermOnPlate( equivalentTerm, emptyCell );

    // always null for this subtype, since terms on the opposite side don't combine
    return null;
  }

  /**
   * Animates terms to empty cells.
   * In this scenario, each term occupies a cell on the plate, and like terms are not combined.
   * If there are no empty cells on the plate, the term is returned to the toolbox where it was created.
   */
  protected override animateToPlate(): void {
    assert && assert( !this.termCreator.combineLikeTermsEnabled, 'should NOT be called when combining like terms' );

    if ( this.plate.isFull() || ( this.equivalentTerm && this.oppositePlate.isFull() ) ) {

      // Plate is full, return to the toolbox.
      this.animateToToolbox();
    }
    else {

      // the target cell and its position
      const cell = this.plate.getBestEmptyCell( this.term.positionProperty.value )!;
      assert && assert( cell );
      const cellPosition = this.plate.getPositionOfCell( cell );

      this.term.pickableProperty.value = this.pickableWhileAnimating;

      this.term.animateTo( cellPosition, {

        // On each animation step...
        animationStepCallback: () => {

          // If the target cell has become occupied, or the opposite plate is full, try again.
          if ( !this.plate.isEmptyCell( cell ) || ( this.equivalentTerm && this.oppositePlate.isFull() ) ) {
            this.animateToPlate();
          }
        },

        // When the term reaches the cell...
        animationCompletedCallback: () => {

          assert && assert( !this.plate.isFull(), 'plate is full' );
          assert && assert( !( this.equivalentTerm && this.oppositePlate.isFull() ), 'opposite plate is full' );

          // Compute cell again, in case a term has been removed below the cell that we were animating to.
          const cell = this.plate.getBestEmptyCell( this.term.positionProperty.value )!;
          assert && assert( cell );

          // Put the term on the plate
          this.termCreator.putTermOnPlate( this.term, cell );
          this.term.pickableProperty.value = true;

          // Handle related terms on opposite side.
          // Note that equivalentTerm and/or inverseTerm may have been disposed of, so handle that.
          if ( this.equivalentTerm ) {
            if ( this.inverseTerm ) {

              // Equivalent and inverse term cancel each other out.
              !this.inverseTerm.isDisposed && this.inverseTerm.dispose();
              this.inverseTerm = null;
              !this.equivalentTerm.isDisposed && this.equivalentTerm.dispose();
              this.equivalentTerm = null;
            }
            else if ( !this.equivalentTerm.isDisposed ) {

              // Transfer this.equivalentTerm to a local variable and set to null, so that equivalentTerm
              // no longer tracks movement of term. See https://github.com/phetsims/equality-explorer/issues/90
              const equivalentTerm = this.equivalentTerm;
              this.equivalentTerm = null;

              // Put equivalent term on the opposite plate
              const equivalentCell = this.oppositePlate.getBestEmptyCell( equivalentTerm.positionProperty.value )!;
              assert && assert( equivalentCell );
              this.equivalentTermCreator.putTermOnPlate( equivalentTerm, equivalentCell );
              equivalentTerm.pickableProperty.value = true;
            }
            else {

              // Do nothing - equivalentTerm was disposed before animationCompletedCallback was called.
              // See https://github.com/phetsims/equality-explorer/issues/88
              this.equivalentTerm = null;
            }
          }

          assert && assert( this.equivalentTerm === null, 'equivalentTerm should be null' );
          assert && assert( this.inverseTerm === null, 'inverseTerm should be null' );
        }
      } );
    }
  }
}

equalityExplorer.register( 'SeparateTermsDragListener', SeparateTermsDragListener );