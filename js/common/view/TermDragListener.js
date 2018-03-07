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
    this.term = term;
    this.termNode = termNode;
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

        term.dragging = true;
        term.shadowVisibleProperty.value = true;

        termNode.moveToFront();

        term.moveTo( self.eventToLocation( event ) );

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

        // refresh the halos that appear when dragged term overlaps its inverse
        self.refreshHalos();
      },

      /**
       * Called at the end of a drag cycle, on pointer up.
       * @param {Event} event
       * @param {Trail} trail
       */
      end: function( event, trail ) {

        term.dragging = false;
        term.shadowVisibleProperty.value = false;

        if ( self.inverseTerm ) {

          // we identified an inverse for this term, sum to zero
          self.sumToZero();
        }
        else if ( term.locationProperty.value.y > plate.locationProperty.value.y + EqualityExplorerQueryParameters.plateYOffset ) {

          // term was released below the plate, animate back to panel and dispose
          animateToPanel( term );
        }
        else {

          // term was released above the plate
          animateToPlate( term, termCreator, plate );
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

  /**
   * Returns a Term to the panel where it was created.
   * @param {Term} term
   */
  function animateToPanel( term ) {
    term.animateTo( term.locationProperty.initialValue, {
      animationCompletedCallback: function() {
        term.dispose();
      }
    } );
  }

  /**
   * Animates a term to the plate.
   * @param {Term} term
   * @param {TermCreator} termCreator
   * @param {Plate} plate
   */
  function animateToPlate( term, termCreator, plate ) {
    if ( termCreator.combineLikeTerms ) {
      animateToLikeCell( term, termCreator, plate );
    }
    else {
      animateToEmptyCell( term, termCreator, plate );
    }
  }

  /**
   * Animates a term to the cell for like terms.
   * In this scenarios, each term *type* occupies a specific cell on the plate.
   * If there's a term in that cell, then terms are combined to produce a new term that occupies the cell.
   * Or if the terms sum to zero, then the sum-to-zero animation is performed.
   * @param term
   * @param termCreator
   * @param plate
   */
  function animateToLikeCell( term, termCreator, plate ) {
    assert && assert( termCreator.combineLikeTerms, 'should ONLY be called when combining like terms' );

    var cellIndex = termCreator.likeTermsCellIndex;
    var cellLocation = plate.getLocationOfCell( cellIndex );

    term.animateTo( cellLocation, {

      // When the term reaches the cell ...
      animationCompletedCallback: function() {

        if ( plate.isEmptyCell( cellIndex ) ) {

          // If the cell is unoccupied, make a 'big' copy of this term and put it in the cell.
          var termCopy = termCreator.copyTerm( term, {
            diameter: EqualityExplorerConstants.BIG_TERM_DIAMETER
          } );
          termCreator.putTermOnPlate( termCopy, cellIndex );

          // dispose of the original term
          term.dispose();
        }
        else {

          // If the cell is occupied...
          // Get the term that occupies the cell.
          var termInCell =  plate.getTermInCell( cellIndex );

          // Combine the terms to create a new 'big' term.
          var combinedTerm = termCreator.combineTerms( term, termInCell, {
            diameter: EqualityExplorerConstants.BIG_TERM_DIAMETER
          } );

          // Dispose of the terms that were used to create the combined term.
          // As a side-effect, this removes termInCell from the plate.
          term.dispose();
          termInCell.dispose();

          if ( combinedTerm ) {

            // Put the new term on the plate.
            combinedTerm.termCreator.putTermOnPlate( combinedTerm, cellIndex );
          }
          else {
            //TODO perform sum-to-zero animation without halo
          }
        }
      }
    } );
  }

  /**
   * Animates a term to an empty cell.
   * In this scenario, each term occupies a cell on the plate, and we do not sum like terms.
   * If there are no empty cells on the plate, the term is returned to the panel where it was created.
   * @param {Term} term
   * @param {TermCreator} termCreator
   * @param {Plate} plate
   */
  function animateToEmptyCell( term, termCreator, plate ) {
    assert && assert( !termCreator.combineLikeTerms, 'should NOT be called when combining like terms' );

    var cellIndex = plate.getClosestEmptyCell( term.locationProperty.value );
    if ( cellIndex === -1 ) {

      // Plate has become full, or there is no available cell above the term's location.
      // Return the term to panel.
      animateToPanel( term );
    }
    else {

      var cellLocation = plate.getLocationOfCell( cellIndex );

      term.animateTo( cellLocation, {

        // If the target cell has become occupied, choose another cell.
        animationStepCallback: function() {
          if ( !plate.isEmptyCell( cellIndex ) ) {
            animateToEmptyCell( term, termCreator, plate );
          }
        },

        // When the term reaches the cell, put it in the cell.
        animationCompletedCallback: function() {
          termCreator.putTermOnPlate( term, cellIndex );
        }
      } );
    }
  }

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
     * Refreshes the visual feedback (yellow halos) that is provided when a dragged term
     * overlaps its inverse on the scale. See equality-explorer#17
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
     * Sums a term and its inverse to zero, and performs the associated animation. See equality-explorer#17
     * @private
     */
    sumToZero: function() {
      assert && assert( this.inverseTerm, 'no inverse' );

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

      // show '0' or '0x' in yellow halo, fade out
      var sumToZeroNode = new SumToZeroNode( {
        symbol: symbol,
        haloRadius: this.haloRadius,
        center: sumToZeroLocation
      } );
      parent.addChild( sumToZeroNode );
      sumToZeroNode.startAnimation();
    }
  } );
} );
 