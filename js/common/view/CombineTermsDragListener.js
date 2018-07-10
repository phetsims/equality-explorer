// Copyright 2018, University of Colorado Boulder

/**
 * Drag listener used when like terms are combined in one cell on a plate.
 * See terminology and requirements in TermDragListener supertype.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var SumToZeroNode = require( 'EQUALITY_EXPLORER/common/view/SumToZeroNode' );
  var TermDragListener = require( 'EQUALITY_EXPLORER/common/view/TermDragListener' );

  /**
   * @param {Node} termNode - Node that the listener is attached to
   * @param {Term} term - the term being dragged
   * @param {TermCreator} termCreator - the creator of term
   * @param {Object} [options]
   * @constructor
   */
  function CombineTermsDragListener( termNode, term, termCreator, options ) {
    assert && assert( termCreator.combineLikeTermsEnabled,
      'CombineTermsDragListener is used when like terms are combined' );
    TermDragListener.call( this, termNode, term, termCreator, options );
  }

  equalityExplorer.register( 'CombineTermsDragListener', CombineTermsDragListener );

  return inherit( TermDragListener, CombineTermsDragListener, {

    //-------------------------------------------------------------------------------------------------
    // Below here is the implementation of the TermDragListener API
    //-------------------------------------------------------------------------------------------------

    /**
     * Called at the start of a drag cycle, when lock is on, to handle related terms on the opposite side of the scale.
     * @returns {boolean} true=success, false=failure
     * @protected
     * @override
     */
    startOpposite: function() {
      assert && assert( this.termCreator.lockedProperty.value, 'startOpposite should only be called when lock is on' );

      var likeTermsCell = this.termCreator.likeTermsCell;
      var oppositeLikeTerm = this.oppositePlate.getTermInCell( likeTermsCell );

      var inverseTerm;

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
          _.extend( this.term.copyOptions(), {
            sign: -1
          } ) );
        this.equivalentTermCreator.putTermOnPlate( inverseTerm, this.termCreator.likeTermsCell );
      }

      // create the equivalent term last, so it's in front
      this.equivalentTerm = this.equivalentTermCreator.createTerm( this.term.copyOptions() );

      return true;
    },

    /**
     * Called at the end of a drag cycle, when lock is on, to handle related terms on the opposite side of the scale.
     * @returns {SumToZeroNode|null} non-null if the drag results in terms on the opposite plate summing to zero
     * @protected
     * @override
     */
    endOpposite: function() {
      assert && assert( this.termCreator.lockedProperty.value, 'endOpposite should only be called when lock is on' );

      var cell = this.termCreator.likeTermsCell;
      var oppositeLikeTerm = this.oppositePlate.getTermInCell( cell );
      if ( oppositeLikeTerm ) {

        // opposite cell is occupied, combine equivalentTerm with term that's in the cell
        var combinedTerm = oppositeLikeTerm.plus( this.equivalentTerm );
        this.equivalentTermCreator.removeTermFromPlate( oppositeLikeTerm );

        // dispose of the terms used to create combinedTerm
        !oppositeLikeTerm.disposed && oppositeLikeTerm.dispose();
        oppositeLikeTerm = null;
        !this.equivalentTerm.disposed && this.equivalentTerm.dispose();
        this.equivalentTerm = null;

        if ( combinedTerm.significantValue.getValue() === 0 ) {

          // Combined term is zero. No halo, since the terms are on the opposite side.
          var oppositeSumToZeroNode = new SumToZeroNode( {
            variable: combinedTerm.variable || null,
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
        var equivalentTermCopy = this.equivalentTerm.copy( {
          diameter: EqualityExplorerConstants.BIG_TERM_DIAMETER
        } );
        !this.equivalentTerm.disposed && this.equivalentTerm.dispose();
        this.equivalentTerm = null;
        this.equivalentTermCreator.putTermOnPlate( equivalentTermCopy, cell );
      }

      return oppositeSumToZeroNode || null;
    },

    /**
     * Animates terms to the cell for like terms.
     * All like terms occupy a specific cell on the plate.
     * If there's a term in that cell, then terms are combined to produce a new term that occupies the cell.
     * If the terms sum to zero, then the sum-to-zero animation is performed.
     * @protected
     * @override
     */
    animateToPlate: function() {

      var self = this;
      var likeTermsCell = this.termCreator.likeTermsCell;
      var cellLocation = this.plate.getLocationOfCell( likeTermsCell );
      var sumToZeroParent = this.termNode.getParent();

      self.term.pickableProperty.value = this.pickableWhileAnimating;

      this.term.animateTo( cellLocation, {

        // When the term reaches the cell ...
        animationCompletedCallback: function() {

          var termInCell = self.plate.getTermInCell( likeTermsCell );
          var maxIntegerExceeded = false;

          //=======================================================================
          // On dragged term's side of the scale
          //=======================================================================

          if ( !termInCell ) {

            // If the cell is empty, make a 'big' copy of this term and put it in the cell.
            var termCopy = self.term.copy( {
              diameter: EqualityExplorerConstants.BIG_TERM_DIAMETER
            } );
            self.termCreator.putTermOnPlate( termCopy, likeTermsCell );

            // dispose of the original term
            !self.term.disposed && self.term.dispose();
            self.term = null;
          }
          else {

            // If the cell is not empty. Combine the terms to create a new 'big' term.
            var combinedTerm = termInCell.plus( self.term );

            if ( combinedTerm.maxIntegerExceeded() ) {

              // The combined term would exceed the maxInteger limit. Make no changes to the other terms.
              maxIntegerExceeded = true;
              termInCell.haloVisibleProperty.value = false;
              combinedTerm.dispose();
              combinedTerm = null;
            }
            else if ( combinedTerm.sign === 0 ) {

              // Terms sum to zero. No halo, since the terms did not overlap when drag ended.
              var sumToZeroNode = new SumToZeroNode( {
                variable: self.term.variable || null,
                fontSize: EqualityExplorerConstants.SUM_TO_ZERO_BIG_FONT_SIZE
              } );

              // dispose of terms that sum to zero
              !self.term.disposed && self.term.dispose();
              self.term = null;
              !termInCell.disposed && termInCell.dispose();
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

          if ( self.equivalentTerm && !maxIntegerExceeded ) {

            var oppositeLikeTerm = self.oppositePlate.getTermInCell( likeTermsCell );

            if ( !oppositeLikeTerm ) {

              // If the cell on the opposite side is empty, make a 'big' copy of equivalentTerm and put it in the cell.
              var equivalentTermCopy = self.equivalentTerm.copy( {
                diameter: EqualityExplorerConstants.BIG_TERM_DIAMETER
              } );
              self.equivalentTermCreator.putTermOnPlate( equivalentTermCopy, likeTermsCell );

              // dispose of the original equivalentTerm
              !self.equivalentTerm.disposed && self.equivalentTerm.dispose();
              self.equivalentTerm = null;
            }
            else {

              // The cell is not empty. Combine equivalentTerm with term that's in the cell
              var oppositeCombinedTerm = oppositeLikeTerm.plus( self.equivalentTerm );

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
                !self.equivalentTerm.disposed && self.equivalentTerm.dispose();
                self.equivalentTerm = null;

                if ( oppositeCombinedTerm.significantValue.getValue() === 0 ) {

                  // terms summed to zero on opposite plate. No halo, since these terms are on opposite side.
                  var oppositeSumToZeroNode = new SumToZeroNode( {
                    variable: oppositeCombinedTerm.variable || null,
                    fontSize: EqualityExplorerConstants.SUM_TO_ZERO_BIG_FONT_SIZE
                  } );

                  // dispose of combined term
                  oppositeCombinedTerm.dispose();
                  oppositeCombinedTerm = null;
                }
                else {

                  // Put the combined term on the plate.
                  self.equivalentTermCreator.putTermOnPlate( oppositeCombinedTerm, likeTermsCell );
                }
              }
            }
          }

          // If we still have equivalentTerm, restore its pickability.
          if ( self.equivalentTerm ) {
            self.equivalentTerm.pickableProperty.value = true;
            self.equivalentTerm = null;
          }

          if ( maxIntegerExceeded ) {

            // Notify listeners that maxInteger would be exceeded by this drag sequence.
            self.termCreator.maxIntegerExceededEmitter.emit();
          }
          else {

            if ( combinedTerm ) {

              // dispose of the terms used to create the combined term
              !self.term.disposed && self.term.dispose();
              self.term = null;
              !termInCell.disposed && termInCell.dispose();
              termInCell = null;

              // Put the combined term on the plate.
              self.termCreator.putTermOnPlate( combinedTerm, likeTermsCell );
            }

            // Do sum-to-zero animations after both plates have moved.
            if ( sumToZeroNode ) {
              sumToZeroParent.addChild( sumToZeroNode );
              sumToZeroNode.center = self.plate.getLocationOfCell( likeTermsCell );
              sumToZeroNode.startAnimation();
            }
            if ( oppositeSumToZeroNode ) {
              sumToZeroParent.addChild( oppositeSumToZeroNode );
              oppositeSumToZeroNode.center = self.oppositePlate.getLocationOfCell( likeTermsCell );
              oppositeSumToZeroNode.startAnimation();
            }
          }

          assert && assert( self.equivalentTerm === null, 'equivalentTerm should be null' );
        }
      } );
    }
  } );
} );