// Copyright 2017-2018, University of Colorado Boulder

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
  var EqualityExplorerQueryParameters = require( 'EQUALITY_EXPLORER/common/EqualityExplorerQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var SumToZeroNode = require( 'EQUALITY_EXPLORER/common/view/SumToZeroNode' );
  var Touch = require( 'SCENERY/input/Touch' );

  /**
   * @param {Node} termNode - Node that the listener is attached to
   * @param {AbstractTerm} term - the term being dragged
   * @param {AbstractTermCreator} termCreator - the creator of term
   * @param {Plate} plate - the plate on the scale that the term is associated with
   * @param {Object} [options]
   * @constructor
   */
  function TermDragListener( termNode, term, termCreator, plate, options ) {

    var self = this;

    options = _.extend( {
      haloRadius: 10
    }, options );

    // @private
    this.term = term;
    this.termNode = termNode;
    this.plate = plate;
    this.haloRadius = options.haloRadius;

    // @private {Node} term the is the inverse of the term being dragged. E.g. 1 and -1, x and -x
    this.inverseTerm = null;

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

        if ( termCreator.isTermOnScale( term ) ) {
          termCreator.removeTermFromScale( term );
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

          // term was released above the plate, animate to closest empty cell
          animateToClosestEmptyCell( term, termCreator, plate );
        }
      }
    } );

    // @private When the plate moves, or its contents change, refresh the halos around inverse terms.
    var refreshHalosBound = this.refreshHalos.bind( this );
    plate.locationProperty.link( refreshHalosBound ); // unlink required
    plate.contentsChangedEmitter.addListener( refreshHalosBound ); // removeListener required

    // @private called by dispose
    this.disposeTermDragListener = function() {
      plate.locationProperty.unlink( refreshHalosBound );
      plate.contentsChangedEmitter.removeListener( refreshHalosBound );
    };
  }

  equalityExplorer.register( 'TermDragListener', TermDragListener );

  /**
   * Returns an Term to the panel where it was created.
   * @param {AbstractTerm} term
   * @private
   */
  function animateToPanel( term ) {
    term.animateTo( term.locationProperty.initialValue, {
      animationCompletedCallback: function() {
        term.dispose();
      }
    } );
  }

  /**
   * Animates a term to an empty cell on a plate.
   * If there are no empty cells on the plate, the term is returned to the panel where it was created.
   * @param {AbstractTerm} term
   * @param {AbstractTermCreator} termCreator
   * @param {Plate} plate
   * @private
   */
  function animateToClosestEmptyCell( term, termCreator, plate ) {

    var cellIndex = plate.getClosestEmptyCell( term.locationProperty.value );
    if ( cellIndex === -1 ) {

      // Plate has become full, or there is no available cell above the term's location.
      // Return the term to panel.
      animateToPanel( term );
    }
    else {

      var cellLocation = plate.getLocationForCell( cellIndex );

      term.animateTo( cellLocation, {

        // If the target cell has become occupied, choose another cell.
        animationStepCallback: function() {
          if ( !plate.isEmptyCell( cellIndex ) ) {
            animateToClosestEmptyCell( term, termCreator, plate );
          }
        },

        // When the term reaches the cell, put it in the cell.
        animationCompletedCallback: function() {
          termCreator.putTermOnScale( term, cellIndex );
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

      // touch: center icon above finger, so that most of icon is clearly visible
      // mouse: move bottom center of icon to pointer location
      var xOffset = 0;
      var yOffset = ( event.pointer instanceof Touch ) ? -( 1.5 * this.term.icon.height ) : -( 0.5 * this.term.icon.height );
      var location = this.termNode.globalToParentPoint( event.pointer.point ).plusXY( xOffset, yOffset );

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
      var sumToZeroLocation = this.plate.getLocationForCell( cellIndex );

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
 