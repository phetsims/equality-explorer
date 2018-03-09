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

    assert && assert( termNode instanceof Node, 'invalid termNode' );
    assert && assert( term instanceof Term, 'invalid term' );
    assert && assert( termCreator instanceof TermCreator, 'invalid termCreator' );
    assert && assert( plate instanceof Plate, 'invalid plate' );

    var self = this;

    options = _.extend( {
      haloRadius: 10
    }, options );

    // @private
    this.termNode = termNode;
    this.term = term;
    this.termCreator = termCreator;
    this.plate = plate;
    this.haloRadius = options.haloRadius;
    this.inverseTerm = null; // {Term} inverse of the term being dragged. E.g. 1 and -1, x and -x

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

        if ( self.inverseTerm ) {

          // we identified an inverse for this term, sum to zero
          self.sumToZero( {
            haloBaseColor: 'rgba( 255, 255, 0, 0.85 )' // show the halo, since the terms overlap
          } );
        }
        else if ( term.locationProperty.value.y > plate.locationProperty.value.y + EqualityExplorerQueryParameters.plateYOffset ) {

          // term was released below the plate, animate back to panel
          self.animateToPanel();
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
     * Returns the term to the panel where it was created.
     * @private
     */
    animateToPanel: function() {
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
      if ( this.termCreator.combineLikeTerms ) {
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
      assert && assert( this.termCreator.combineLikeTerms, 'should ONLY be called when combining like terms' );

      var self = this;
      var cellIndex = this.termCreator.likeTermsCellIndex;
      var cellLocation = this.plate.getLocationOfCell( cellIndex );

      this.term.animateTo( cellLocation, {

        // When the term reaches the cell ...
        animationCompletedCallback: function() {

          if ( self.plate.isEmptyCell( cellIndex ) ) {

            // If the cell is empty, make a 'big' copy of this term and put it in the cell.
            var termCopy = self.termCreator.copyTerm( self.term, {
              diameter: EqualityExplorerConstants.BIG_TERM_DIAMETER
            } );
            self.termCreator.putTermOnPlate( termCopy, cellIndex );

            // dispose of the original term
            self.term.dispose();
          }
          else {

            // If the cell is occupied...
            // Get the term that occupies the cell.
            var termInCell = self.plate.getTermInCell( cellIndex );

            // Combine the terms to create a new 'big' term.
            var combinedTerm = self.termCreator.combineTerms( self.term, termInCell, {
              diameter: EqualityExplorerConstants.BIG_TERM_DIAMETER
            } );

            if ( combinedTerm ) {

              // Put the new term on the plate.
              self.term.dispose();
              termInCell.dispose();
              combinedTerm.termCreator.putTermOnPlate( combinedTerm, cellIndex );
            }
            else {

              // Terms sum to zero.
              self.inverseTerm = termInCell;
              self.sumToZero(); // no halo, since the terms did not overlap when drag ended
            }
          }
        }
      } );
    },

    /**
     * Animates the term to an empty cell.
     * In this scenario, each term occupies a cell on the plate, and like terms are not combined.
     * If there are no empty cells on the plate, the term is returned to the panel where it was created.
     * @private
     */
    animateToEmptyCell: function() {
      assert && assert( !this.termCreator.combineLikeTerms, 'should NOT be called when combining like terms' );

      var cellIndex = this.plate.getClosestEmptyCell( this.term.locationProperty.value );

      if ( cellIndex === -1 ) {

        // Plate is full. Return the term to its panel.
        this.animateToPanel( this.term );
      }
      else {

        var self = this;
        var cellLocation = this.plate.getLocationOfCell( cellIndex );

        this.term.animateTo( cellLocation, {

          // If the target cell has become occupied, choose another cell.
          animationStepCallback: function() {
            if ( !self.plate.isEmptyCell( cellIndex ) ) {
              self.animateToEmptyCell();
            }
          },

          // When the term reaches the cell, put it in the cell.
          animationCompletedCallback: function() {
            self.termCreator.putTermOnPlate( self.term, cellIndex );
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
     * Refreshes the visual feedback (yellow halos) that is provided when a dragged term overlaps an inverse term
     * that is on the scale. See equality-explorer#17
     * @private
     */
    refreshHalos: function() {

      if ( this.term.dragging && this.term.haloVisibleProperty ) {

        var previousInverseTerm = this.inverseTerm;
        this.inverseTerm = null;

        // does this term overlap an inverse term on the plate?
        var termOnPlate = this.plate.getTermAtLocation( this.term.locationProperty.value );
        if ( termOnPlate && termOnPlate.isInverseOf( this.term ) ) {
          this.inverseTerm = termOnPlate;
        }

        // if the inverse term is new, then clean up previous inverse term
        if ( previousInverseTerm && ( previousInverseTerm !== this.inverseTerm ) ) {
          previousInverseTerm.haloVisibleProperty.value = false;
        }

        if ( !this.inverseTerm ) {

          // no inverse term
          this.term.shadowVisibleProperty.value = true;
          this.term.haloVisibleProperty.value = false;
        }
        else if ( this.inverseTerm !== previousInverseTerm ) {

          // new inverse term
          this.termNode.moveToFront();
          this.term.shadowVisibleProperty.value = false;
          this.term.haloVisibleProperty.value = true;
          this.inverseTerm.haloVisibleProperty.value = true;
        }
      }
    },

    /**
     * Sums the term and its inverse to zero.
     * Disposes of both terms, and performs the associated animation.
     * See equality-explorer#17
     * @param {Object} [options] - passed to SumToZero constructor
     * @private
     */
    sumToZero: function( options ) {
      assert && assert( this.inverseTerm, 'no inverse' );
      assert && assert( this.term.weight.plusFraction( this.inverseTerm.weight ).toDecimal() === 0,
        'terms do not sum to zero' );

      // determine which cell the inverse term appears in
      var cellIndex = this.plate.getCellForTerm( this.inverseTerm );

      // some things we need before the terms are deleted
      var symbol = this.term.symbol || null;
      var parent = this.termNode.getParent();

      // delete the 2 terms that sum to zero
      this.term.dispose();
      this.inverseTerm.dispose();

      // after the terms have been deleted and the scale has moved,
      // determine the new location of the inverse term's cell
      var sumToZeroLocation = this.plate.getLocationOfCell( cellIndex );

      options = _.extend( {
        symbol: symbol,
        haloRadius: this.haloRadius,
        center: sumToZeroLocation
      }, options );

      //TODO clean up, this is a bit of a hack
      // If we're replacing a 'big' term on the scale, use big font
      if ( this.inverseTerm.diameter === EqualityExplorerConstants.BIG_TERM_DIAMETER ) {
        options.fontSize = EqualityExplorerConstants.SUM_TO_ZERO_BIG_FONT_SIZE
      }

      // show '0' or '0x' in yellow halo, fade out
      var sumToZeroNode = new SumToZeroNode( options );
      parent.addChild( sumToZeroNode );
      sumToZeroNode.startAnimation();
    }
  } );
} );
 