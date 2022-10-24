// Copyright 2018-2022, University of Colorado Boulder

/**
 * Drag listener used when like terms are combined in one cell on a plate.
 * See terminology and requirements in TermDragListener supertype.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import equalityExplorer from '../../equalityExplorer.js';
import EqualityExplorerConstants from '../EqualityExplorerConstants.js';
import SumToZeroNode from './SumToZeroNode.js';
import TermDragListener, { TermDragListenerOptions } from './TermDragListener.js';
import TermNode from './TermNode.js';
import Term from '../model/Term.js';
import TermCreator, { CreateTermOptions } from '../model/TermCreator.js';
import { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

type SelfOptions = EmptySelfOptions;

type CombineTermsDragListenerOptions = SelfOptions & TermDragListenerOptions;

export default class CombineTermsDragListener extends TermDragListener {

  /**
   * @param termNode - Node that the listener is attached to
   * @param term - the term being dragged
   * @param termCreator - the creator of term
   * @param [providedOptions]
   */
  public constructor( termNode: TermNode, term: Term, termCreator: TermCreator, providedOptions?: CombineTermsDragListenerOptions ) {
    assert && assert( termCreator.combineLikeTermsEnabled, 'CombineTermsDragListener is used when like terms are combined' );
    super( termNode, term, termCreator, providedOptions );
  }

  //-------------------------------------------------------------------------------------------------
  // Below here is the implementation of the TermDragListener API
  //-------------------------------------------------------------------------------------------------

  /**
   * Called at the start of a drag cycle, when lock is on, to handle related terms on the opposite side of the scale.
   * @returns true=success, false=failure
   */
  protected override startOpposite(): boolean {
    assert && assert( this.termCreator.lockedProperty.value, 'startOpposite should only be called when lock is on' );

    const likeTermsCell = this.termCreator.likeTermsCell!;
    assert && assert( likeTermsCell !== null );
    let oppositeLikeTerm = this.oppositePlate.getTermInCell( likeTermsCell );

    let inverseTerm;

    if ( oppositeLikeTerm ) {

      // subtract term from what's on the opposite plate
      inverseTerm = oppositeLikeTerm.minus( this.term );
      this.equivalentTermCreator.removeTermFromPlate( oppositeLikeTerm );
      oppositeLikeTerm.dispose();
      oppositeLikeTerm = null;
      if ( inverseTerm.significantValue.getValue() === 0 ) {
        inverseTerm.dispose();
        inverseTerm = null;
      }
      else {
        this.equivalentTermCreator.putTermOnPlate( inverseTerm, likeTermsCell );
      }
    }
    else {

      // there was nothing on the opposite plate, so create the inverse of the equivalent term
      inverseTerm = this.equivalentTermCreator.createTerm(
        combineOptions<CreateTermOptions>( {}, this.term.copyOptions(), {
          sign: -1
        } ) );
      this.equivalentTermCreator.putTermOnPlate( inverseTerm, likeTermsCell );
    }

    // create the equivalent term last, so it's in front
    this.equivalentTerm = this.equivalentTermCreator.createTerm( this.term.copyOptions() );

    return true;
  }

  /**
   * Called at the end of a drag cycle, when lock is on, to handle related terms on the opposite side of the scale.
   * @returns non-null if the drag results in terms on the opposite plate summing to zero
   */
  protected override endOpposite(): SumToZeroNode | null {
    assert && assert( this.termCreator.lockedProperty.value, 'endOpposite should only be called when lock is on' );

    // {SumToZeroNode|null} truthy when terms sum to zero
    let oppositeSumToZeroNode = null;

    const cell = this.termCreator.likeTermsCell!;
    assert && assert( cell !== null );
    let oppositeLikeTerm = this.oppositePlate.getTermInCell( cell );
    if ( oppositeLikeTerm ) {

      const equivalentTerm = this.equivalentTerm!;
      assert && assert( equivalentTerm );

      // opposite cell is occupied, combine equivalentTerm with term that's in the cell
      let combinedTerm: Term | null = oppositeLikeTerm.plus( equivalentTerm );
      this.equivalentTermCreator.removeTermFromPlate( oppositeLikeTerm );

      // dispose of the terms used to create combinedTerm
      !oppositeLikeTerm.isDisposed && oppositeLikeTerm.dispose();
      oppositeLikeTerm = null;
      !equivalentTerm.isDisposed && equivalentTerm.dispose();
      this.equivalentTerm = null;

      if ( combinedTerm.significantValue.getValue() === 0 ) {

        // Combined term is zero. No halo, since the terms are on the opposite side.
        oppositeSumToZeroNode = new SumToZeroNode( { //TODO dynamic
          variable: combinedTerm.getVariable(),
          fontSize: EqualityExplorerConstants.SUM_TO_ZERO_BIG_FONT_SIZE
        } );

        // dispose of the combined term
        combinedTerm.dispose();
        combinedTerm = null;
      }
      else {

        // put the non-zero combined term on the opposite plate
        this.equivalentTermCreator.putTermOnPlate( combinedTerm, cell );
      }
    }
    else {

      // opposite cell is empty, put a big copy of equivalentTerm in that cell
      const equivalentTerm = this.equivalentTerm!;
      assert && assert( equivalentTerm );
      const equivalentTermCopy = equivalentTerm.copy( {
        diameter: EqualityExplorerConstants.BIG_TERM_DIAMETER
      } );
      !equivalentTerm.isDisposed && equivalentTerm.dispose();
      this.equivalentTerm = null;
      this.equivalentTermCreator.putTermOnPlate( equivalentTermCopy, cell );
    }

    return oppositeSumToZeroNode;
  }

  /**
   * Animates terms to the cell for like terms.
   * All like terms occupy a specific cell on the plate.
   * If there's a term in that cell, then terms are combined to produce a new term that occupies the cell.
   * If the terms sum to zero, then the sum-to-zero animation is performed.
   */
  protected override animateToPlate(): void {

    const likeTermsCell = this.termCreator.likeTermsCell!;
    assert && assert( likeTermsCell !== null );
    const cellPosition = this.plate.getPositionOfCell( likeTermsCell );

    // This must be done here. If this.term is disposed later in this method, this.termNode will also be disposed,
    // and will not have a parent.
    const sumToZeroParent = this.termNode.getParent()!;
    assert && assert( sumToZeroParent, 'expected termNode to have a parent' );

    this.term.pickableProperty.value = this.pickableWhileAnimating;

    this.term.animateTo( cellPosition, {

      // When the term reaches the cell ...
      animationCompletedCallback: () => {

        let termInCell = this.plate.getTermInCell( likeTermsCell );
        let maxIntegerExceeded = false;
        let combinedTerm; // {Term|undefined} defined when terms are combined to create a new 'big' term
        let sumToZeroNode; // {SumToZeroNode|undefined} defined when terms sum to zero

        //=======================================================================
        // On dragged term's side of the scale
        //=======================================================================

        if ( !termInCell ) {

          // If the cell is empty, make a 'big' copy of this term and put it in the cell.
          const termCopy = this.term.copy( {
            diameter: EqualityExplorerConstants.BIG_TERM_DIAMETER
          } );
          this.termCreator.putTermOnPlate( termCopy, likeTermsCell );

          // dispose of the original term
          !this.term.isDisposed && this.term.dispose();
        }
        else {

          // If the cell is not empty. Combine the terms to create a new 'big' term.
          combinedTerm = termInCell.plus( this.term );

          if ( combinedTerm.maxIntegerExceeded() ) {

            // The combined term would exceed the maxInteger limit. Make no changes to the other terms.
            maxIntegerExceeded = true;
            termInCell.haloVisibleProperty.value = false;
            combinedTerm.dispose();
            combinedTerm = null;
          }
          else if ( combinedTerm.sign === 0 ) {

            // Terms sum to zero. No halo, since the terms did not overlap when drag ended.
            sumToZeroNode = new SumToZeroNode( { //TODO dynamic
              variable: this.term.getVariable(),
              fontSize: EqualityExplorerConstants.SUM_TO_ZERO_BIG_FONT_SIZE
            } );

            // dispose of terms that sum to zero
            !this.term.isDisposed && this.term.dispose();
            !termInCell.isDisposed && termInCell.dispose();
            termInCell = null;
            combinedTerm.dispose();
            combinedTerm = null;
          }
          else {
            // Defer putting combinedTerm on the plate until after we deal with equivalentTerm,
            // in case the equivalentTerm causes maxInteger to be exceeded.
          }
        }

        //=======================================================================
        // On opposite side of the scale
        //=======================================================================

        let oppositeSumToZeroNode; // {undefined|SumToZeroNode} defined if terms summed to zero on opposite plate
        if ( this.equivalentTerm && !maxIntegerExceeded ) {

          let oppositeLikeTerm = this.oppositePlate.getTermInCell( likeTermsCell );

          if ( !oppositeLikeTerm ) {

            // If the cell on the opposite side is empty, make a 'big' copy of equivalentTerm and put it in the cell.
            const equivalentTermCopy = this.equivalentTerm.copy( {
              diameter: EqualityExplorerConstants.BIG_TERM_DIAMETER
            } );
            this.equivalentTermCreator.putTermOnPlate( equivalentTermCopy, likeTermsCell );

            // dispose of the original equivalentTerm
            !this.equivalentTerm.isDisposed && this.equivalentTerm.dispose();
            this.equivalentTerm = null;
          }
          else {

            // The cell is not empty. Combine equivalentTerm with term that's in the cell
            let oppositeCombinedTerm: Term | null = oppositeLikeTerm.plus( this.equivalentTerm );

            if ( oppositeCombinedTerm.maxIntegerExceeded() ) {

              // The combined term would exceed the maxInteger limit. Make no changes to the other terms.
              maxIntegerExceeded = true;
              oppositeLikeTerm.haloVisibleProperty.value = false;
              oppositeCombinedTerm.dispose();
              oppositeCombinedTerm = null;
            }
            else {

              // dispose of the terms used to create oppositeCombinedTerm
              oppositeLikeTerm.dispose();
              oppositeLikeTerm = null;
              !this.equivalentTerm.isDisposed && this.equivalentTerm.dispose();
              this.equivalentTerm = null;

              if ( oppositeCombinedTerm.significantValue.getValue() === 0 ) {

                // terms summed to zero on opposite plate. No halo, since these terms are on opposite side.
                oppositeSumToZeroNode = new SumToZeroNode( { //TODO dynamic
                  variable: oppositeCombinedTerm.getVariable(),
                  fontSize: EqualityExplorerConstants.SUM_TO_ZERO_BIG_FONT_SIZE
                } );

                // dispose of combined term
                oppositeCombinedTerm.dispose();
                oppositeCombinedTerm = null;
              }
              else {

                // Put the combined term on the plate.
                this.equivalentTermCreator.putTermOnPlate( oppositeCombinedTerm, likeTermsCell );
              }
            }
          }
        }

        // If we still have equivalentTerm, restore its pickability.
        if ( this.equivalentTerm ) {
          this.equivalentTerm.pickableProperty.value = true;
          this.equivalentTerm = null;
        }

        if ( maxIntegerExceeded ) {

          // Notify listeners that maxInteger would be exceeded by this drag sequence.
          this.termCreator.maxIntegerExceededEmitter.emit();
        }
        else {

          if ( combinedTerm ) {

            // dispose of the terms used to create the combined term
            !this.term.isDisposed && this.term.dispose();
            assert && assert( termInCell );
            !termInCell!.isDisposed && termInCell!.dispose();
            termInCell = null;

            // Put the combined term on the plate.
            this.termCreator.putTermOnPlate( combinedTerm, likeTermsCell );
          }

          // Do sum-to-zero animations after both plates have moved.
          if ( sumToZeroNode ) {
            sumToZeroParent.addChild( sumToZeroNode );
            sumToZeroNode.center = this.plate.getPositionOfCell( likeTermsCell );
            sumToZeroNode.startAnimation();
          }
          if ( oppositeSumToZeroNode ) {
            sumToZeroParent.addChild( oppositeSumToZeroNode );
            oppositeSumToZeroNode.center = this.oppositePlate.getPositionOfCell( likeTermsCell );
            oppositeSumToZeroNode.startAnimation();
          }
        }

        assert && assert( this.equivalentTerm === null, 'equivalentTerm should be null' );
      }
    } );
  }
}

equalityExplorer.register( 'CombineTermsDragListener', CombineTermsDragListener );