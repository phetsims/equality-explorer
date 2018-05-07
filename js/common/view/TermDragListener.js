// Copyright 2018, University of Colorado Boulder

//TODO #89 break TermDragListener up into smaller chunks
/**
 * Drag listener for terms.
 *
 * Terminology:
 * - The dragged term is the term that you’re dragging.
 * - The equivalent term is the term on the opposite side that follows along with the dragged term.
 *   It has the same value as the dragged term. For example, if you’re dragging 2x, the equivalent term will also be 2x.
 * - The inverse term is the term that is created on the opposite plate if no equivalent term is already on the plate.
 *   It’s value is the inverse of the equivalent term.  For example, if the equivalent term is 2x, the inverse term
 *   is -2x.  (Inverse term is only relevant for the Numbers and Variables screens. In Operations, the equivalent term
 *   is subtracted from what’s on the plate.)
 * - The opposite plate is the plate associated with the equivalent term, opposite the dragging term.
 *
 * Note that event.currentTarget should NOT be used herein. Because of event forwarding from TermCreatorNode,
 * event.currentTarget may not be what you expect it to be.  See SimpleDragHandler.createForwardingListener
 * in TermCreatorNode.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var EqualityExplorerColors = require( 'EQUALITY_EXPLORER/common/EqualityExplorerColors' );
  var EqualityExplorerConstants = require( 'EQUALITY_EXPLORER/common/EqualityExplorerConstants' );
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var OopsDialog = require( 'EQUALITY_EXPLORER/common/view/OopsDialog' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var SumToZeroNode = require( 'EQUALITY_EXPLORER/common/view/SumToZeroNode' );
  var Term = require( 'EQUALITY_EXPLORER/common/model/Term' );
  var TermCreator = require( 'EQUALITY_EXPLORER/common/model/TermCreator' );

  // strings
  var leftSideOfBalanceIsFullString = require( 'string!EQUALITY_EXPLORER/leftSideOfBalanceIsFull' );
  var rightSideOfBalanceIsFullString = require( 'string!EQUALITY_EXPLORER/rightSideOfBalanceIsFull' );

  /**
   * @param {Node} termNode - Node that the listener is attached to
   * @param {Term} term - the term being dragged
   * @param {TermCreator} termCreator - the creator of term
   * @param {Object} [options] - specific to TermDragListener, not propagated to supertype
   * @constructor
   */
  function TermDragListener( termNode, term, termCreator, options ) {

    assert && assert( termNode instanceof Node, 'invalid termNode: ' + termNode );
    assert && assert( term instanceof Term, 'invalid term: ' + term );
    assert && assert( termCreator instanceof TermCreator, 'invalid termCreator: ' + termCreator );

    var self = this;

    options = _.extend( {
      haloRadius: 10, // radius of the halo around terms that sum to zero
      pickableWhileAnimating: true // is termNode pickable while term is animating?
    }, options );

    // @private
    this.termNode = termNode;
    this.term = term;
    this.termCreator = termCreator;
    this.haloRadius = options.haloRadius;
    this.pickableWhileAnimating = options.pickableWhileAnimating;

    // @private related terms
    this.likeTerm = null; // {Term|null} like term that is overlapped while dragging
    this.equivalentTerm = null; // {Term|null} equivalent term on opposite plate, for lock feature
    this.inverseTerm = null; // {Term|null} inverse term on opposite plate, for lock feature

    // @private to improve readability
    this.plate = termCreator.plate;
    this.equivalentTermCreator = termCreator.equivalentTermCreator;
    this.oppositePlate = termCreator.equivalentTermCreator.plate;

    // @private If the inverse term is dragged, break the association between equivalentTerm and inverseTerm
    this.inverseTermDraggingListener = function( dragging ) {
      assert && assert( self.inverseTerm, 'there is no associated inverse term' );
      if ( dragging ) {
        if ( self.inverseTerm.draggingProperty.hasListener( self.inverseTermDraggingListener ) ) {
          self.inverseTerm.draggingProperty.unlink( self.inverseTermDraggingListener );
        }
        self.inverseTerm = null;
      }
    };

    SimpleDragHandler.call( this, {

      allowTouchSnag: true,

      /**
       * Called at the start of a drag cycle, on pointer down.
       * @param {Event} event
       * @param {Trail} trail
       */
      start: function( event, trail ) {

        if ( termCreator.isTermOnPlate( term ) ) {

          if ( termCreator.lockedProperty.value ) {
            if ( termCreator.combineLikeTermsEnabled ) {

              //=======================================================================
              // Like terms combined in one cell
              //=======================================================================

              var oppositeLikeTerm = self.oppositePlate.getTermInCell( termCreator.likeTermsCell );

              // no need to track self.inverseTerm when like terms are combined, so uses a local var
              var inverseTerm;

              if ( oppositeLikeTerm ) {

                // subtract term from what's on the opposite plate
                inverseTerm = oppositeLikeTerm.minus( term );
                self.equivalentTermCreator.removeTermFromPlate( oppositeLikeTerm );
                oppositeLikeTerm.dispose();
                oppositeLikeTerm = null;
                if ( inverseTerm.significantValue.getValue() === 0 ) {
                  inverseTerm.dispose();
                  inverseTerm = null;
                }
                else {
                  self.equivalentTermCreator.putTermOnPlate( inverseTerm, termCreator.likeTermsCell );
                }
              }
              else {

                // there was nothing on the opposite plate, so create the inverse of the equivalent term
                inverseTerm = self.equivalentTermCreator.createTerm(
                  _.extend( term.copyOptions(), {
                    sign: -1
                  } ) );
                self.equivalentTermCreator.putTermOnPlate( inverseTerm, termCreator.likeTermsCell );
              }

              // create the equivalent term last, so it's in front
              self.equivalentTerm = self.equivalentTermCreator.createTerm( term.copyOptions() );
            }
            else {

              //=======================================================================
              // Like terms in separate cells
              //=======================================================================

              var termCell = self.plate.getCellForTerm( term );
              self.equivalentTerm = self.oppositePlate.getClosestEquivalentTerm( term, termCell );
              if ( self.equivalentTerm ) {

                // found equivalent term on opposite plate, remove it from plate
                self.equivalentTermCreator.removeTermFromPlate( self.equivalentTerm );
              }
              else if ( self.oppositePlate.isFull() ) {

                // opposite plate is full, cannot create inverse term, show 'Oops' message
                var thisIsLeft = ( termCreator.positiveLocation.x < self.equivalentTermCreator.positiveLocation.x );
                var message = thisIsLeft ? rightSideOfBalanceIsFullString : leftSideOfBalanceIsFullString;
                var oopsDialog = new OopsDialog( message );
                oopsDialog.show();

                // interrupt this drag sequence, since we can't take term off the plate
                self.interrupt();
                return; // generally bad form to return from the middle of a function, but this is a workaround
              }
              else {

                // no equivalent term on opposite plate, create an inverse term
                self.inverseTerm = self.equivalentTermCreator.createTerm( _.extend( term.copyOptions(), {
                  sign: -1
                } ) );
                var inverseTermLocation = termCreator.getEquivalentTermLocation( term );
                var inverseCell = self.oppositePlate.getBestEmptyCell( inverseTermLocation );
                self.equivalentTermCreator.putTermOnPlate( self.inverseTerm, inverseCell );

                // if the inverse term is dragged, break the association to equivalentTerm
                self.inverseTerm.draggingProperty.link( self.inverseTermDraggingListener );

                // create the equivalent term on the opposite side
                // Do this after creating inverseTerm so that it appear in front of inverseTerm.
                self.equivalentTerm = self.equivalentTermCreator.createTerm( term.copyOptions() );
              }
            }
          }

          termCreator.removeTermFromPlate( term );
        }
        else if ( !term.isAnimating() ) {

          // term came from toolbox. If lock is enabled, create an equivalent term on other side of the scale.
          if ( termCreator.lockedProperty.value ) {
            self.equivalentTerm = self.equivalentTermCreator.createTerm( term.copyOptions() );
          }
        }

        // move the term a bit, so it's obvious that we're interacting with it
        term.moveTo( self.eventToLocation( event ) );

        // set term properties at beginning of drag
        term.draggingProperty.value = true;
        term.shadowVisibleProperty.value = true;
        if ( self.equivalentTerm ) {
          self.equivalentTerm.shadowVisibleProperty.value = true;
          self.equivalentTerm.pickableProperty.value = false;
        }

        // move the node we're dragging to the foreground
        termNode.moveToFront();
      },

      /**
       * Called while termNode is being dragged.
       * @param {Event} event
       * @param {Trail} trail
       */
      drag: function( event, trail ) {

        // move the term
        term.moveTo( self.eventToLocation( event ) );

        // refresh the halos that appear when dragged term overlaps with an inverse term
        self.refreshHalos();
      },

      /**
       * Called at the end of a drag cycle, on pointer up.
       * @param {Event} event
       * @param {Trail} trail
       */
      end: function( event, trail ) {

        // drag sequence was interrupted, return immediately
        if ( self.interrupted ) { return; }

        // set term properties at end of drag
        term.draggingProperty.value = false;
        term.shadowVisibleProperty.value = false;
        if ( self.equivalentTerm ) {
          self.equivalentTerm.shadowVisibleProperty.value = false;
        }

        if ( !termCreator.combineLikeTermsEnabled &&
             ( self.plate.isFull() || ( self.equivalentTerm && self.oppositePlate.isFull() ) ) ) {

          // each term needs its own cell and one of the plates is full
          self.refreshHalos();
          self.animateToToolbox();
        }
        else if ( self.likeTerm && term.isInverseTerm( self.likeTerm ) ) {

          var sumToZeroParent = termNode.getParent();

          // term overlaps a term on the scale, and they sum to zero
          var sumToZeroNode = new SumToZeroNode( {
            variable: term.variable || null,
            haloRadius: self.haloRadius,
            haloBaseColor: EqualityExplorerColors.HALO, // show the halo
            fontSize: self.termCreator.combineLikeTermsEnabled ?
                      EqualityExplorerConstants.SUM_TO_ZERO_BIG_FONT_SIZE :
                      EqualityExplorerConstants.SUM_TO_ZERO_SMALL_FONT_SIZE
          } );
          sumToZeroParent.addChild( sumToZeroNode );
          var sumToZeroCell = self.plate.getCellForTerm( self.likeTerm );

          // dispose of terms that sum to zero
          term.dispose();
          term = null;
          self.likeTerm.dispose();
          self.likeTerm = null;

          // put equivalent term on opposite plate
          if ( self.equivalentTerm ) {
            if ( termCreator.combineLikeTermsEnabled ) {

              //=======================================================================
              // Like terms combined in one cell
              //=======================================================================

              var cell = termCreator.likeTermsCell;
              var oppositeLikeTerm = self.oppositePlate.getTermInCell( cell );
              if ( oppositeLikeTerm ) {

                // opposite cell is occupied, combine equivalentTerm with term that's in the cell
                var combinedTerm = oppositeLikeTerm.plus( self.equivalentTerm );
                self.equivalentTermCreator.removeTermFromPlate( oppositeLikeTerm );

                // dispose of the terms used to create combinedTerm
                oppositeLikeTerm.dispose();
                oppositeLikeTerm = null;
                self.equivalentTerm.dispose();
                self.equivalentTerm = null;

                if ( combinedTerm.significantValue.getValue() === 0 ) {

                  // Combined term is zero. No halo, since the terms are on the opposite side.
                  var oppositeSumToZeroNode = new SumToZeroNode( {
                    variable: combinedTerm.variable || null,
                    fontSize: EqualityExplorerConstants.SUM_TO_ZERO_BIG_FONT_SIZE
                  } );
                  sumToZeroParent.addChild( oppositeSumToZeroNode );
                  var oppositeSumToZeroCell = termCreator.likeTermsCell;

                  // dispose of the combined term
                  combinedTerm.dispose();
                  combinedTerm = null;
                }
                else {
                  self.equivalentTermCreator.putTermOnPlate( combinedTerm, cell );
                }
              }
              else {

                // opposite cell is empty, put a big copy of equivalentTerm in that cell
                var equivalentTermCopy = self.equivalentTerm.copy( {
                  diameter: EqualityExplorerConstants.BIG_TERM_DIAMETER
                } );
                self.equivalentTerm.dispose();
                self.equivalentTerm = null;
                self.equivalentTermCreator.putTermOnPlate( equivalentTermCopy, cell );
              }
            }
            else {

              //=======================================================================
              // Like terms in separate cells
              //=======================================================================

              // put equivalent term in an empty cell
              var emptyCell = self.oppositePlate.getBestEmptyCell( self.equivalentTerm.locationProperty.value );
              self.equivalentTermCreator.putTermOnPlate( self.equivalentTerm, emptyCell );
            }
            self.detachRelatedTerms();
          }

          // Do sum-to-zero animations after plates have moved
          sumToZeroNode.center = self.plate.getLocationOfCell( sumToZeroCell );
          sumToZeroNode.startAnimation();
          if ( oppositeSumToZeroNode ) {
            oppositeSumToZeroNode.center = self.oppositePlate.getLocationOfCell( oppositeSumToZeroCell );
            oppositeSumToZeroNode.startAnimation();
          }
        }
        else if ( term.locationProperty.value.y > self.plate.locationProperty.value.y + EqualityExplorerQueryParameters.plateYOffset ) {

          // term was released below the plate, animate back to toolbox
          self.animateToToolbox();
        }
        else {

          // term was released above the plate, animate to the plate
          self.animateToPlate();
        }
      }
    } );

    // Equivalent term tracks the movement of the dragged term.
    var locationListener = function( location ) {
      if ( self.equivalentTerm ) {
        self.equivalentTerm.moveTo( termCreator.getEquivalentTermLocation( term ) );
      }
    };
    term.locationProperty.link( locationListener ); // unlink required in dispose

    // @private When the plate moves, or its contents change, refresh the halos around overlapping terms.
    var refreshHalosBound = this.refreshHalos.bind( this );
    this.plate.locationProperty.link( refreshHalosBound ); // unlink required in dispose
    this.plate.contentsChangedEmitter.addListener( refreshHalosBound ); // removeListener required in dispose

    // @private called by dispose
    this.disposeTermDragListener = function() {

      if ( term.locationProperty.hasListener( locationListener ) ) {
        term.locationProperty.unlink( locationListener );
      }

      if ( self.plate.locationProperty.hasListener( refreshHalosBound ) ) {
        self.plate.locationProperty.unlink( refreshHalosBound );
      }

      if ( self.plate.contentsChangedEmitter.hasListener( refreshHalosBound ) ) {
        self.plate.contentsChangedEmitter.removeListener( refreshHalosBound );
      }

      // Do NOT call detachRelatedTerms!
      // Operations involving terms will still be in progress after dispose is called.
    };
  }

  equalityExplorer.register( 'TermDragListener', TermDragListener );

  return inherit( SimpleDragHandler, TermDragListener, {

    /**
     * @public
     * @override
     */
    dispose: function() {
      this.disposeTermDragListener();
      SimpleDragHandler.prototype.dispose.call( this );
    },

    /**
     * Detaches terms that are related to this drag listener, but specific to a drag sequence.
     * @private
     */
    detachRelatedTerms: function() {

      // like term
      this.likeTerm = null;

      // equivalent term
      if ( this.equivalentTerm && !this.equivalentTerm.disposed ) {
        this.equivalentTerm.pickableProperty.value = true;
      }
      this.equivalentTerm = null;

      // inverse term
      if ( this.inverseTerm && !this.inverseTerm.disposed ) {
        if ( this.inverseTerm.draggingProperty.hasListener( this.inverseTermDraggingListener ) ) {
          this.inverseTerm.draggingProperty.unlink( this.inverseTermDraggingListener );
        }
      }
      this.inverseTerm = null;
    },

    /**
     * Returns the term to the toolbox where it was created.
     * @private
     */
    animateToToolbox: function() {
      assert && assert( this.term.toolboxLocation, 'toolboxLocation was not initialized for term: ' + this.term );

      this.term.pickableProperty.value = this.pickableWhileAnimating;

      // dispose of the term when it reaches the toolbox
      var self = this;
      this.term.animateTo( this.term.toolboxLocation, {
        animationCompletedCallback: function() {
          self.term.dispose();
          self.term = null;
          if ( self.equivalentTerm ) {
            self.equivalentTerm.dispose();
            self.equivalentTerm = null;
          }
          self.detachRelatedTerms();
        }
      } );
    },

    /**
     * Animates the term to the plate.
     * @private
     */
    animateToPlate: function() {
      if ( this.termCreator.combineLikeTermsEnabled ) {
        this.animateToLikeCell();
      }
      else {
        this.animateToEmptyCell();
      }
    },

    /**
     * Animates a term to the cell for like terms.
     * In this scenarios, all like terms occupy a specific cell on the plate.
     * If there's a term in that cell, then terms are combined to produce a new term that occupies the cell.
     * Or if the terms sum to zero, then the sum-to-zero animation is performed.
     * @private
     */
    animateToLikeCell: function() {
      assert && assert( this.termCreator.combineLikeTermsEnabled, 'should ONLY be called when combining like terms' );

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
            self.term.dispose();
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
              self.term.dispose();
              self.term = null;
              termInCell.dispose();
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
              self.equivalentTerm.dispose();
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
                self.equivalentTerm.dispose();
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

          if ( maxIntegerExceeded ) {

            // Notify listeners that maxInteger would be exceeded by this drag sequence.
            self.termCreator.maxIntegerExceededEmitter.emit();
          }
          else {

            if ( combinedTerm ) {

              // dispose of the terms used to create the combined term
              self.term.dispose();
              self.term = null;
              termInCell.dispose();
              termInCell = null;

              // Put the new term on the plate.
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

          self.detachRelatedTerms();
        }
      } );
    },

    /**
     * Animates the term to an empty cell.
     * In this scenario, each term occupies a cell on the plate, and like terms are not combined.
     * If there are no empty cells on the plate, the term is returned to the toolbox where it was created.
     * @private
     */
    animateToEmptyCell: function() {
      assert && assert( !this.termCreator.combineLikeTermsEnabled, 'should NOT be called when combining like terms' );

      if ( this.plate.isFull() || ( this.equivalentTerm && this.oppositePlate.isFull() ) ) {

        // Plate is full, return to the toolbox.
        this.animateToToolbox( this.term );
      }
      else {

        var self = this;

        // the target cell and its location
        var cell = this.plate.getBestEmptyCell( this.term.locationProperty.value );
        var cellLocation = this.plate.getLocationOfCell( cell );

        this.term.pickableProperty.value = this.pickableWhileAnimating;

        this.term.animateTo( cellLocation, {

          // On each animation step...
          animationStepCallback: function() {

            // If the target cell has become occupied, choose another cell.
            if ( !self.plate.isEmptyCell( cell ) ) {
              self.animateToEmptyCell();
            }
          },

          // When the term reaches the cell...
          animationCompletedCallback: function() {

            assert && assert( !self.plate.isFull(), 'plate is full' );
            assert && assert( !( self.equivalentTerm && self.oppositePlate.isFull() ), 'opposite plate is full' );

            // Compute cell again, in case a term has been removed below the cell that we were animating to.
            cell = self.plate.getBestEmptyCell( self.term.locationProperty.value );

            // Put the term on the plate
            self.termCreator.putTermOnPlate( self.term, cell );
            self.term.pickableProperty.value = true;

            if ( self.equivalentTerm ) {
              if ( self.inverseTerm ) {

                // Equivalent and inverse term cancel each other out.
                self.inverseTerm.dispose();
                self.inverseTerm = null;
                self.equivalentTerm.dispose();
                self.equivalentTerm = null;
              }
              else {

                // Put equivalent term on the opposite plate
                var equivalentCell = self.oppositePlate.getBestEmptyCell( self.equivalentTerm.locationProperty.value );
                self.equivalentTermCreator.putTermOnPlate( self.equivalentTerm, equivalentCell );
                //TODO #90 next line should be unnecessary, but location is wrong when putting equivalentTerm on right plate
                self.equivalentTerm.moveTo( self.oppositePlate.getLocationOfCell( equivalentCell ) );
              }
            }
            self.detachRelatedTerms();
          }
        } );
      }
    },

    /**
     * Converts an event to a model location.
     * Enforces relationship of the term to the pointer, and constrains the drag bounds.
     * @param {Event} event
     * @returns {Vector2}
     * @private
     */
    eventToLocation: function( event ) {

      // move bottom center of termNode to pointer location
      var location = this.termNode.globalToParentPoint( event.pointer.point ).minusXY( 0, this.termNode.contentNodeSize.height / 2 );

      // constrain to drag bounds
      return this.term.dragBounds.closestPointTo( location );
    },

    /**
     * Refreshes the visual feedback (yellow halo) that is provided when a dragged term overlaps
     * a like term that is on the scale. This has the side-effect of setting this.likeTerm.
     * See https://github.com/phetsims/equality-explorer/issues/17
     * @private
     */
    refreshHalos: function() {

      if ( this.term.draggingProperty.value ) {

        var previousLikeTerm = this.likeTerm;
        this.likeTerm = null;

        // does this term overlap a like term on the plate?
        var termOnPlate = this.plate.getTermAtLocation( this.term.locationProperty.value );
        if ( termOnPlate && termOnPlate.isLikeTerm( this.term ) ) {
          this.likeTerm = termOnPlate;
        }

        // if the like term is new, then clean up previous like term
        if ( previousLikeTerm && ( previousLikeTerm !== this.likeTerm ) ) {
          previousLikeTerm.haloVisibleProperty.value = false;
        }

        if ( this.likeTerm && ( this.termCreator.combineLikeTermsEnabled || this.term.isInverseTerm( this.likeTerm ) ) ) {

          // terms will combine, show halo for term and likeTerm
          this.term.shadowVisibleProperty.value = false;
          this.term.haloVisibleProperty.value = true;
          this.likeTerm.haloVisibleProperty.value = true;
        }
        else {

          // term will not combine
          this.term.shadowVisibleProperty.value = true;
          this.term.haloVisibleProperty.value = false;
        }
      }
      else {
        this.term.shadowVisibleProperty.value = false;
        this.term.haloVisibleProperty.value = false;
        if ( this.likeTerm ) {
          this.likeTerm.haloVisibleProperty.value = false;
        }
      }
    }
  } );
} );