// Copyright 2018, University of Colorado Boulder

/**
 * Drag listener for terms.
 *
 * Note that event.currentTarget should NOT be used herein. Because of event forwarding from TermCreatorNode,
 * event.currentTarget may not be what you expect it to be.
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
  var Plate = require( 'EQUALITY_EXPLORER/common/model/Plate' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var SumToZeroNode = require( 'EQUALITY_EXPLORER/common/view/SumToZeroNode' );
  var Term = require( 'EQUALITY_EXPLORER/common/model/Term' );
  var TermCreator = require( 'EQUALITY_EXPLORER/common/model/TermCreator' );

  /**
   * @param {Node} termNode - Node that the listener is attached to
   * @param {Term} term - the term being dragged
   * @param {TermCreator} termCreator - the creator of term
   * @param {Plate} plate - the plate on the scale that the term is associated with
   * @param {Object} [options]
   * @constructor
   */
  function TermDragListener( termNode, term, termCreator, plate, options ) {

    assert && assert( termNode instanceof Node, 'invalid termNode: ' + termNode );
    assert && assert( term instanceof Term, 'invalid term: ' + term );
    assert && assert( termCreator instanceof TermCreator, 'invalid termCreator: ' + termCreator );
    assert && assert( plate instanceof Plate, 'invalid plate: ' + plate );

    var self = this;

    options = _.extend( {
      haloRadius: 10 // radius of the halo around terms that sum to zero
    }, options );

    // @private
    this.termNode = termNode;
    this.term = term;
    this.termCreator = termCreator;
    this.plate = plate;
    this.haloRadius = options.haloRadius;
    this.likeTerm = null; // {Term|null} like term that is overlapped while dragging

    SimpleDragHandler.call( this, {

      allowTouchSnag: true,

      /**
       * Called at the start of a drag cycle, on pointer down.
       * @param {Event} event
       * @param {Trail} trail
       */
      start: function( event, trail ) {

        // move the node we're dragging to the foreground
        termNode.moveToFront();

        // set term properties at beginning of drag
        term.dragging = true;
        term.shadowVisibleProperty.value = true;

        // move the term a bit, so it's obvious that we're interacting with it
        term.moveTo( self.eventToLocation( event ) );

        // if the term is on the plate, remove it from the plate
        if ( termCreator.isTermOnPlate( term ) ) {
          termCreator.removeTermFromPlate( term );
        }
      },

      /**
       * Called while the Node is being dragged.
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

        // set term properties at end of drag
        term.dragging = false;
        term.shadowVisibleProperty.value = false;

        if ( self.likeTerm && term.isInverseTerm( self.likeTerm ) ) {

          // term overlaps an inverse term, sum to zero
          self.sumToZero( self.likeTerm, {
            haloBaseColor: EqualityExplorerColors.HALO // show the halo, since the terms overlap
          } );
        }
        else if ( term.locationProperty.value.y > plate.locationProperty.value.y + EqualityExplorerQueryParameters.plateYOffset ) {

          // term was released below the plate, animate back to toolbox
          self.animateToToolbox();
        }
        else {

          // term was released above the plate, animate to the plate
          self.animateToPlate();
        }
      }
    } );

    // @private When the plate moves, or its contents change, refresh the halos around inverse terms.
    var refreshHalosBound = this.refreshHalos.bind( this );
    plate.locationProperty.link( refreshHalosBound ); // unlink required in dispose
    plate.contentsChangedEmitter.addListener( refreshHalosBound ); // removeListener required in dispose

    // @private called by dispose
    this.disposeTermDragListener = function() {
      if ( plate.locationProperty.hasListener( refreshHalosBound ) ) {
        plate.locationProperty.unlink( refreshHalosBound );
      }
      if ( plate.contentsChangedEmitter.hasListener( refreshHalosBound ) ) {
        plate.contentsChangedEmitter.removeListener( refreshHalosBound );
      }
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
     * Returns the term to the toolbox where it was created.
     * @private
     */
    animateToToolbox: function() {
      var self = this;
      this.term.animateTo( this.term.locationProperty.initialValue, {
        animationCompletedCallback: function() {
          self.term.dispose();
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
      var cell = this.termCreator.likeTermsCell;
      var cellLocation = this.plate.getLocationOfCell( cell );

      this.term.animateTo( cellLocation, {

        // When the term reaches the cell ...
        animationCompletedCallback: function() {

          if ( self.plate.isEmptyCell( cell ) ) {

            // If the cell is empty, make a 'big' copy of this term and put it in the cell.
            var termCopy = self.termCreator.copyTerm( self.term, {
              diameter: EqualityExplorerConstants.BIG_TERM_DIAMETER
            } );
            self.termCreator.putTermOnPlate( termCopy, cell );

            // dispose of the original term
            self.term.dispose();
          }
          else {

            // If the cell is occupied...
            // Get the term that occupies the cell.
            var termInCell = self.plate.getTermInCell( cell );

            // Combine the terms to create a new 'big' term.
            var combinedTerm = self.termCreator.combineTerms( self.term, termInCell, {
              diameter: EqualityExplorerConstants.BIG_TERM_DIAMETER
            } );

            if ( combinedTerm ) {

              if ( self.termCreator.isNumberLimitExceeded( combinedTerm ) ) {

                // Notify listeners that the combined term would exceed the number limit
                // Make no changes to the other terms.
                self.termCreator.numberLimitExceededEmitter.emit();
                termInCell.haloVisibleProperty.value = false;
              }
              else {
                // dispose of the terms used to create the combined term
                self.term.dispose();
                termInCell.dispose();

                // Put the new term on the plate.
                self.termCreator.putTermOnPlate( combinedTerm, cell );
              }
            }
            else {

              // Terms sum to zero.
              // No halo, since the terms did not overlap when drag ended.
              self.sumToZero( termInCell );
            }
          }
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

      // careful, cell is a {number}
      var cell = this.plate.getClosestEmptyCell( this.term.locationProperty.value );

      if ( cell === null ) {

        // Plate is full. Return the term to its toolbox.
        this.animateToToolbox( this.term );
      }
      else {

        var self = this;
        var cellLocation = this.plate.getLocationOfCell( cell );

        this.term.animateTo( cellLocation, {

          // If the target cell has become occupied, choose another cell.
          animationStepCallback: function() {
            if ( !self.plate.isEmptyCell( cell ) ) {
              self.animateToEmptyCell();
            }
          },

          // When the term reaches the cell, put it in the cell.
          animationCompletedCallback: function() {
            self.termCreator.putTermOnPlate( self.term, cell );
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

      //TODO revisit this
      // move bottom center of termNode to pointer location
      var location = this.termNode.globalToParentPoint( event.pointer.point ).minusXY( 0, this.termNode.contentNodeSize.height / 2 );

      // constrain to drag bounds
      return this.term.dragBounds.closestPointTo( location );
    },

    /**
     * Refreshes the visual feedback (yellow halos) that is provided when a dragged term overlaps
     * a like term that is on the scale. This has the side-effect of setting this.likeTerm.
     * See equality-explorer#17
     * @private
     */
    refreshHalos: function() {

      if ( this.term.dragging ) {

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

        if ( !this.likeTerm ) {

          // no like term
          this.term.shadowVisibleProperty.value = true;
          this.term.haloVisibleProperty.value = false;
        }
        else if ( this.likeTerm !== previousLikeTerm &&
                  ( this.termCreator.combineLikeTermsEnabled || this.term.isInverseTerm( this.likeTerm ) ) ) {

          // show halo for term and likeTerm
          this.termNode.moveToFront();
          this.term.shadowVisibleProperty.value = false;
          this.term.haloVisibleProperty.value = true;
          this.likeTerm.haloVisibleProperty.value = true;
        }
      }
    },

    /**
     * Sums the term and its inverse to zero.
     * Disposes of both terms, and performs the associated animation.
     * See equality-explorer#17
     * @param {Term} {inverseTerm}
     * @param {Object} [options] - passed to SumToZero constructor
     * @private
     */
    sumToZero: function( inverseTerm, options ) {
      assert && assert( this.term.isInverseTerm( inverseTerm ), 'inverseTerm is not an inverse: ' + inverseTerm );

      // determine which cell the inverse term appears in
      var cell = this.plate.getCellForTerm( inverseTerm );

      // some things we need before the terms are disposed
      var variable = this.term.variable || null;
      var parent = this.termNode.getParent();

      // delete the 2 terms that sum to zero
      this.term.dispose();
      inverseTerm.dispose();

      // after the terms have been deleted and the scale has moved,
      // determine the new location of the inverse term's cell
      var sumToZeroLocation = this.plate.getLocationOfCell( cell );

      options = _.extend( {
        variable: variable,
        haloRadius: this.haloRadius,
        center: sumToZeroLocation
      }, options );

      // If we're combining like terms on the scale (e.g. in Operations screen), use big font
      if ( this.termCreator.combineLikeTermsEnabled ) {
        options.fontSize = EqualityExplorerConstants.SUM_TO_ZERO_BIG_FONT_SIZE;
      }

      // show '0' or '0x' in yellow halo, fade out
      var sumToZeroNode = new SumToZeroNode( options );
      parent.addChild( sumToZeroNode );
      sumToZeroNode.startAnimation();
    }
  } );
} );
 