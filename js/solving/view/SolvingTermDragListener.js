// Copyright 2018, University of Colorado Boulder

/**
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var equalityExplorer = require( 'EQUALITY_EXPLORER/equalityExplorer' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Plate = require( 'EQUALITY_EXPLORER/common/model/Plate' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
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
  function SolvingTermDragListener( termNode, term, termCreator, plate, options ) {

    //TODO duplicated from TermDragListener
    assert && assert( termNode instanceof Node, 'invalid termNode' );
    assert && assert( term instanceof Term, 'invalid term' );
    assert && assert( termCreator instanceof TermCreator, 'invalid termCreator' );
    assert && assert( plate instanceof Plate, 'invalid plate' );

    var self = this;

    //TODO duplicated from TermDragListener
    options = _.extend( {
      haloRadius: 10
    }, options );

    //TODO duplicated from TermDragListener
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

        if ( termCreator.isTermOnScale( term ) ) {
          termCreator.removeTermFromScale( term );
        }
      },

      drag: function( event, trail ) {},

      end: function( event, trail ) {}
    } );

    //TODO duplicated from TermDragListener
    // @private When the plate moves, or its contents change, refresh the halos around inverse terms.
    var refreshHalosBound = this.refreshHalos.bind( this );
    plate.locationProperty.link( refreshHalosBound ); // unlink required in dispose
    plate.contentsChangedEmitter.addListener( refreshHalosBound ); // removeListener required in dispose

    //TODO duplicated from TermDragListener
    // @private called by dispose
    this.disposeSolvingTermDragListener = function() {
      if ( plate.locationProperty.hasListener( refreshHalosBound ) ) {
        plate.locationProperty.unlink( refreshHalosBound );
      }
      if ( plate.contentsChangedEmitter.hasListener( refreshHalosBound ) ) {
        plate.contentsChangedEmitter.removeListener( refreshHalosBound );
      }
    };
  }

  equalityExplorer.register( 'SolvingTermDragListener', SolvingTermDragListener );

  return inherit( SimpleDragHandler, SolvingTermDragListener, {

    /**
     * @public
     * @override
     */
    dispose: function() {
      this.disposeSolvingTermDragListener();
      SimpleDragHandler.prototype.dispose.call( this );
    },

    //TODO duplicated from TermDragListener
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

    //TODO duplicated from TermDragListener
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

    //TODO duplicated from TermDragListener
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