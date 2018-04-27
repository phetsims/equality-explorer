// Copyright 2018, University of Colorado Boulder

/**
 * Drag listener for terms.
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
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var SumToZeroNode = require( 'EQUALITY_EXPLORER/common/view/SumToZeroNode' );
  var Term = require( 'EQUALITY_EXPLORER/common/model/Term' );
  var TermCreator = require( 'EQUALITY_EXPLORER/common/model/TermCreator' );

  /**
   * @param {Node} termNode - Node that the listener is attached to
   * @param {Term} term - the term being dragged
   * @param {TermCreator} termCreator - the creator of term
   * @param {Object} [options]
   * @constructor
   */
  function TermDragListener( termNode, term, termCreator, options ) {

    assert && assert( termNode instanceof Node, 'invalid termNode: ' + termNode );
    assert && assert( term instanceof Term, 'invalid term: ' + term );
    assert && assert( termCreator instanceof TermCreator, 'invalid termCreator: ' + termCreator );

    var self = this;

    options = _.extend( {
      haloRadius: 10, // radius of the halo around terms that sum to zero

      //TODO #19 delete this when we finalize whether this is possible for lock feature
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
            //TODO #19 get equivalent term from opposite plate, possibly create inverse, OopsDialog, etc.
          }
          termCreator.removeTermFromPlate( term );
        }
        else if ( !term.isAnimating() ) {

          //TODO #19 lock is temporarily disabled for the Operations screen
          if ( !self.termCreator.combineLikeTermsEnabled ) {

            // term came from toolbox. If lock is enabled, create an equivalent term on other side of the scale.
            if ( termCreator.lockedProperty.value ) {
              self.equivalentTerm = self.equivalentTermCreator.createTerm(
                _.extend( term.copyOptions(), {
                  pickable: false
                } ) );
              self.equivalentTerm.shadowVisibleProperty.value = true;
            }
          }
        }

        // move the term a bit, so it's obvious that we're interacting with it
        term.moveTo( self.eventToLocation( event ) );

        // set term properties at beginning of drag
        term.draggingProperty.value = true;
        term.shadowVisibleProperty.value = true;

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

        //TODO #83 any performance concern here?
        // since multiple terms may be dragged via multi-touch, keep the most-recently-moved term on top
        termNode.moveToFront();

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
        term.draggingProperty.value = false;
        term.shadowVisibleProperty.value = false;
        if ( self.equivalentTerm ) {
          self.equivalentTerm.shadowVisibleProperty.value = false;
        }

        if ( self.equivalentTerm && self.oppositePlate.isFull() ) {

          self.refreshHalos();

          // opposite plate is full
          self.animateToToolbox();
        }
        else if ( self.likeTerm && term.isInverseTerm( self.likeTerm ) ) {

          // term overlaps a term on the scale, and they sum to zero
          self.sumToZero( term, self.likeTerm, {
            haloBaseColor: EqualityExplorerColors.HALO // show the halo
          } );

          // put equivalent term on opposite plate
          if ( self.equivalentTerm ) {
            var equivalentCell = self.oppositePlate.getBestEmptyCell( self.equivalentTerm.locationProperty.value );
            self.equivalentTermCreator.putTermOnPlate( self.equivalentTerm, equivalentCell );
            self.equivalentTerm.pickableProperty.value = true;
            self.equivalentTerm = null;
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
      assert && assert( this.term.toolboxLocation, 'toolboxLocation was not initialized for term: ' + this.term );

      this.term.pickableProperty.value = this.pickableWhileAnimating;

      // dispose of the term when it reaches the toolbox
      var self = this;
      this.term.animateTo( this.term.toolboxLocation, {
        animationCompletedCallback: function() {
          self.term.dispose();
          if ( self.equivalentTerm ) {
            self.equivalentTerm.dispose();
            self.equivalentTerm = null;
          }
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

      self.term.pickableProperty.value = this.pickableWhileAnimating;

      this.term.animateTo( cellLocation, {

        // When the term reaches the cell ...
        animationCompletedCallback: function() {

          var termInCell = self.plate.getTermInCell( cell );

          if ( !termInCell ) {

            // If the cell is empty, make a 'big' copy of this term and put it in the cell.
            var termCopy = self.term.copy( {
              diameter: EqualityExplorerConstants.BIG_TERM_DIAMETER
            } );
            self.termCreator.putTermOnPlate( termCopy, cell );

            // dispose of the original term
            self.term.dispose();
          }
          else {

            // Combine the terms to create a new 'big' term.
            var combinedTerm = termInCell.plus( self.term );

            if ( combinedTerm.sign === 0 ) {

              // Terms sum to zero.
              // No halo, since the terms did not overlap when drag ended.
              self.sumToZero( self.term, termInCell );
            }
            else if ( combinedTerm.maxIntegerExceeded() ) {

              // Notify listeners that the combined term would exceed the maxInteger limit.
              // Make no changes to the other terms.
              self.termCreator.maxIntegerExceededEmitter.emit();
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

        var cell = this.plate.getBestEmptyCell( this.term.locationProperty.value );
        var cellLocation = this.plate.getLocationOfCell( cell );

        this.term.pickableProperty.value = this.pickableWhileAnimating;

        this.term.animateTo( cellLocation, {

          // On each animation step...
          animationStepCallback: function() {
            if ( self.equivalentTerm && self.oppositePlate.isFull() ) {

              // If we have an equivalent term to put on the opposite plate,
              // and the opposite plate is full, return to the toolbox
              self.animateToToolbox( self.term );
            }
            else if ( !self.plate.isEmptyCell( cell ) ) {

              // If the target cell has become occupied, choose another cell.
              self.animateToEmptyCell();
            }
          },

          // When the term reaches the cell...
          animationCompletedCallback: function() {

            if ( self.plate.isFull() || ( self.equivalentTerm && self.oppositePlate.isFull() ) ) {

              // If either plate is full, return to the toolbox.
              self.animateToToolbox( self.term );
            }
            else {

              // Compute cell again, in case a term has been removed below the cell that we were animating to.
              var cell = self.plate.getBestEmptyCell( self.term.locationProperty.value );

              // Put the term on the plate
              self.termCreator.putTermOnPlate( self.term, cell );
              self.term.pickableProperty.value = true;

              // Put equivalent term on the other plate
              if ( self.equivalentTerm ) {
                var equivalentCell = self.oppositePlate.getBestEmptyCell( self.equivalentTerm.locationProperty.value );
                self.equivalentTermCreator.putTermOnPlate( self.equivalentTerm, equivalentCell );
                self.equivalentTerm.pickableProperty.value = true;
                self.equivalentTerm = null;
              }
            }
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
     * Refreshes the visual feedback (yellow halo) that is provided when a dragged term overlaps
     * a like term that is on the scale. This has the side-effect of setting this.likeTerm.
     * See equality-explorer#17
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
    },

    /**
     * Handles the animation and cleanup that happens for 2 terms that sum to zero.
     * See equality-explorer#17
     * @param {Term} termDragging - the term we're dragging
     * @param {Term} termOnScale - a term on the scale
     * @param {Object} [options] - passed to SumToZero constructor
     * @private
     */
    sumToZero: function( termDragging, termOnScale, options ) {
      assert && assert( termDragging.plus( termOnScale ).sign === 0, 'terms do not sum to zero' );

      // determine which cell the term appears in
      var cell = this.plate.getCellForTerm( termOnScale );

      // some things we need before the terms are disposed
      var variable = termDragging.variable || null;
      var parent = this.termNode.getParent(); // SumToZeroNode in the same layer as the TermNode we're dragging

      // dispose of the terms
      termDragging.dispose();
      termOnScale.dispose();

      // after the terms have been disposed and the scale has moved,
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
 