// Copyright 2018-2020, University of Colorado Boulder

/**
 * Drag listener used when like terms occupy separate cells on a plate.
 * Like terms are combined only if they sum to zero.
 * See terminology and requirements in TermDragListener supertype.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import OopsDialog from '../../../../scenery-phet/js/OopsDialog.js';
import equalityExplorer from '../../equalityExplorer.js';
import equalityExplorerStrings from '../../equalityExplorerStrings.js';
import TermDragListener from './TermDragListener.js';

class SeparateTermsDragListener extends TermDragListener {

  /**
   * @param {Node} termNode - Node that the listener is attached to
   * @param {Term} term - the term being dragged
   * @param {TermCreator} termCreator - the creator of term
   * @param {Object} [options]
   */
  constructor( termNode, term, termCreator, options ) {
    assert && assert( !termCreator.combineLikeTermsEnabled,
      'SeparateTermsDragListener is used when like terms occupy separate cells' );

    super( termNode, term, termCreator, options );

    // @private
    this.inverseTerm = null; // {Term|null} inverse term on opposite plate, for lock feature

    // @private If the inverse term is dragged, break the association between equivalentTerm and inverseTerm
    this.inverseTermDraggingListener = dragging => {
      assert && assert( this.inverseTerm, 'there is no associated inverse term' );
      if ( dragging ) {
        if ( this.inverseTerm.draggingProperty.hasListener( this.inverseTermDraggingListener ) ) {
          this.inverseTerm.draggingProperty.unlink( this.inverseTermDraggingListener );
        }
        this.inverseTerm = null;
      }
    };

    // @private
    this.disposeSeparateTermsDragListener = () => {
      if ( this.inverseTerm && this.inverseTerm.draggingProperty.hasListener( this.inverseTermDraggingListener ) ) {
        this.inverseTerm.draggingProperty.unlink( this.inverseTermDraggingListener );
      }
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeSeparateTermsDragListener();
    super.dispose();
  }

  //-------------------------------------------------------------------------------------------------
  // Below here is the implementation of the TermDragListener API
  //-------------------------------------------------------------------------------------------------

  /**
   * Called at the start of a drag cycle, when lock is on, to handle related terms on the opposite side.
   * @returns {boolean} true=success, false=failure
   * @protected
   * @override
   */
  startOpposite() {
    assert && assert( this.termCreator.lockedProperty.value, 'startOpposite should only be called when lock is on' );

    const termCell = this.plate.getCellForTerm( this.term );
    this.equivalentTerm = this.oppositePlate.getClosestEquivalentTerm( this.term, termCell );

    if ( this.equivalentTerm ) {

      // found equivalent term on opposite plate, remove it from plate
      this.equivalentTermCreator.removeTermFromPlate( this.equivalentTerm );
    }
    else if ( this.oppositePlate.isFull() ) {

      // opposite plate is full, cannot create inverse term, show 'Oops' message
      const thisIsLeft = ( this.termCreator.positivePosition.x < this.equivalentTermCreator.positivePosition.x );
      const message = thisIsLeft ? equalityExplorerStrings.rightSideFull : equalityExplorerStrings.leftSideFull;
      const oopsDialog = new OopsDialog( message );
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
      const inverseCell = this.oppositePlate.getBestEmptyCell( inverseTermPosition );
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
   * @returns {SumToZeroNode|null} non-null if the drag results in terms on the opposite plate summing to zero
   * @protected
   * @override
   */
  endOpposite() {
    assert && assert( this.termCreator.lockedProperty.value, 'endOpposite should only be called when lock is on' );

    // put equivalent term in an empty cell
    const emptyCell = this.oppositePlate.getBestEmptyCell( this.equivalentTerm.positionProperty.value );
    this.equivalentTermCreator.putTermOnPlate( this.equivalentTerm, emptyCell );

    // always null for this subtype, since terms on the opposite side don't combine
    return null;
  }

  /**
   * Animates terms to empty cells.
   * In this scenario, each term occupies a cell on the plate, and like terms are not combined.
   * If there are no empty cells on the plate, the term is returned to the toolbox where it was created.
   * @protected
   * @override
   */
  animateToPlate() {
    assert && assert( !this.termCreator.combineLikeTermsEnabled, 'should NOT be called when combining like terms' );

    if ( this.plate.isFull() || ( this.equivalentTerm && this.oppositePlate.isFull() ) ) {

      // Plate is full, return to the toolbox.
      this.animateToToolbox( this.term );
    }
    else {

      // the target cell and its position
      const cell = this.plate.getBestEmptyCell( this.term.positionProperty.value );
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
          const cell = this.plate.getBestEmptyCell( this.term.positionProperty.value );

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
              const equivalentCell = this.oppositePlate.getBestEmptyCell( equivalentTerm.positionProperty.value );
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

export default SeparateTermsDragListener;